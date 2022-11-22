import {
	JavaScriptDefaultImport,
	JavaScriptImports,
	JavaScriptNamedImport,
} from '@/core/JavaScriptImport';
import { JsonArray, JsonLiteral, JsonObject } from '@/core/JsonValue';
import { ESLintRcCjsGenerator } from '@/core/projects/ESLintRcCjsGenerator';
import { EditorConfigGenerator } from '@/core/projects/EditorConfigGenerator';
import { PackageJsonDependency } from '@/core/projects/PackageJsonDependency';
import { PrettierRcJsonGenerator } from '@/core/projects/PrettierRcJsonGenerator';
import { Project, ProjectFile } from '@/core/projects/Project';
import { ReactGitignoreGenerator } from '@/core/projects/ReactGitignoreGenerator';
import dependencies from '@/core/projects/dependencies.json' assert { type: 'json' };
import validate from 'validate-npm-package-name';

export enum OutputType {
	ReactApplication = 'ReactApplication',
	ReactLibrary = 'ReactLibrary',
}

export enum TestingFramework {
	None = 'None',
	Vitest = 'Vitest',
}

export enum UIFramework {
	None = 'None',
	ElasticUI = 'ElasticUI',
}

export enum IconLibrary {
	None = 'None',
	FluentSystemIcons = 'FluentSystemIcons',
}

interface TypeScriptViteReactProjectOptions {
	outputType?: OutputType;
	projectName?: string;
	test?: TestingFramework;
	ui?: UIFramework;
	icon?: IconLibrary;
	enablePrettier?: boolean;
	sortImports?: boolean;
	enableESLint?: boolean;
	configurePathAliases?: boolean;
	useAjv?: boolean;
	useLodash?: boolean;
	useMobX?: boolean;
	useReactRouter?: boolean;
	useQs?: boolean;
}

export class TypeScriptViteReactProject extends Project<TypeScriptViteReactProjectOptions> {
	generatePackageJson = (): string => {
		if (this.options.projectName !== undefined) {
			const { validForNewPackages } = validate(this.options.projectName);
			if (!validForNewPackages) {
				throw new Error('Invalid project name');
			}
		}

		const { tab, newLine } = this.editorConfig;

		const dependenciesObj = new PackageJsonDependency();

		const devDependenciesObj = new PackageJsonDependency()
			.addPackage('@types/react')
			.addPackage('@types/react-dom')
			.addPackage('@vitejs/plugin-react')
			.addPackage('typescript')
			.addPackage('vite');

		const peerDependenciesObj = new PackageJsonDependency();

		if (this.options.outputType === OutputType.ReactLibrary) {
			devDependenciesObj
				.addPackage('react')
				.addPackage('react-dom')
				.addPackage('vite-plugin-dts');
			peerDependenciesObj.addPackage('react').addPackage('react-dom');
		} else {
			dependenciesObj.addPackage('react').addPackage('react-dom');
		}

		switch (this.options.test) {
			case TestingFramework.None:
				// nop
				break;

			case TestingFramework.Vitest:
				devDependenciesObj.addPackage('vitest');
				break;
		}

		switch (this.options.ui) {
			case UIFramework.None:
				// nop
				break;

			case UIFramework.ElasticUI:
				dependenciesObj.addPackage('@elastic/eui');
				dependenciesObj.addPackage('@elastic/datemath');
				dependenciesObj.addPackage('@emotion/react');
				dependenciesObj.addPackage('@emotion/css');
				dependenciesObj.addPackage('moment');
				dependenciesObj.addPackage('prop-types');
				break;
		}

		switch (this.options.icon) {
			case IconLibrary.None:
				// nop
				break;

			case IconLibrary.FluentSystemIcons:
				dependenciesObj.addPackage('@fluentui/react-icons');
				break;
		}

		if (this.options.enablePrettier) {
			devDependenciesObj.addPackage('prettier');

			if (this.options.sortImports) {
				devDependenciesObj.addPackage(
					'@trivago/prettier-plugin-sort-imports',
				);
			}
		}

		if (this.options.enableESLint) {
			devDependenciesObj.addPackage('@typescript-eslint/eslint-plugin');
			devDependenciesObj.addPackage('@typescript-eslint/parser');
			devDependenciesObj.addPackage('eslint');
			devDependenciesObj.addPackage('eslint-config-react-app');
			devDependenciesObj.addPackage('eslint-plugin-flowtype');
			devDependenciesObj.addPackage('eslint-plugin-import');
			devDependenciesObj.addPackage('eslint-plugin-jsx-a11y');
			devDependenciesObj.addPackage('eslint-plugin-react');
			devDependenciesObj.addPackage('eslint-plugin-react-hooks');
		}

		if (this.options.enablePrettier && this.options.enableESLint) {
			devDependenciesObj.addPackage('eslint-config-prettier');
			devDependenciesObj.addPackage('eslint-plugin-prettier');
		}

		const addAdditionalPackage = (
			name: keyof typeof dependencies,
		): void => {
			if (this.options.outputType === OutputType.ReactLibrary) {
				devDependenciesObj.addPackage(name);
				peerDependenciesObj.addPackage(name);
			} else {
				dependenciesObj.addPackage(name);
			}
		};

		if (this.options.useAjv) {
			addAdditionalPackage('ajv');
		}

		if (this.options.useLodash) {
			addAdditionalPackage('lodash-es');
			devDependenciesObj.addPackage('@types/lodash-es');
		}

		if (this.options.useMobX) {
			addAdditionalPackage('mobx');
			addAdditionalPackage('mobx-react-lite');
		}

		if (this.options.useQs) {
			addAdditionalPackage('qs');
			devDependenciesObj.addPackage('@types/qs');
		}

		if (this.options.useReactRouter) {
			addAdditionalPackage('react-router-dom');
		}

		const rootObj = new JsonObject()
			.addEntry('name', this.options.projectName)
			.addEntry('private', true)
			.addEntry('version', '0.0.0')
			.addEntry('type', 'module')
			.addEntry(
				'scripts',
				new JsonObject()
					.addEntry('dev', 'vite')
					.addEntry('build', 'tsc && vite build')
					.addEntry('preview', 'vite preview'),
			)
			.addEntry(
				'dependencies',
				dependenciesObj.entries.length > 0
					? dependenciesObj.orderByKey()
					: undefined,
			)
			.addEntry(
				'devDependencies',
				devDependenciesObj.entries.length > 0
					? devDependenciesObj.orderByKey()
					: undefined,
			)
			.addEntry(
				'peerDependencies',
				peerDependenciesObj.entries.length > 0
					? peerDependenciesObj.orderByKey()
					: undefined,
			);

		if (this.options.outputType === OutputType.ReactLibrary) {
			const cjsFilename = `./dist/index.cjs.js`;
			const esFilename = `./dist/index.es.js`;
			rootObj
				.addEntry('files', new JsonArray().addItem('dist'))
				.addEntry('main', cjsFilename)
				.addEntry('module', esFilename)
				.addEntry('types', './dist/index.d.ts')
				.addEntry(
					'exports',
					new JsonObject().addEntry(
						'.',
						new JsonObject()
							.addEntry('import', esFilename)
							.addEntry('require', cjsFilename),
					),
				);
		}

		return `${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	};

	generateTSConfigJson = (): string => {
		const { tab, newLine } = this.editorConfig;

		const compilerOptionsObj = new JsonObject()
			.addEntry('target', 'ESNext')
			.addEntry('useDefineForClassFields', true)
			.addEntry(
				'lib',
				new JsonArray()
					.addItem('DOM')
					.addItem('DOM.Iterable')
					.addItem('ESNext'),
			)
			.addEntry('allowJs', false)
			.addEntry('skipLibCheck', true)
			.addEntry('esModuleInterop', false)
			.addEntry('allowSyntheticDefaultImports', true)
			.addEntry('strict', true)
			.addEntry('forceConsistentCasingInFileNames', true)
			.addEntry('module', 'ESNext')
			.addEntry('moduleResolution', 'Node')
			.addEntry('resolveJsonModule', true)
			.addEntry('isolatedModules', true)
			.addEntry('noEmit', true)
			.addEntry('jsx', 'react-jsx');

		if (this.options.configurePathAliases) {
			compilerOptionsObj.addEntry('baseUrl', './');
			compilerOptionsObj.addEntry(
				'paths',
				new JsonObject().addEntry(
					'@/*',
					new JsonArray().addItem('src/*'),
				),
			);
		}

		if (this.options.useMobX) {
			compilerOptionsObj.addEntry('experimentalDecorators', true);
		}

		const rootObj = new JsonObject()
			.addEntry('compilerOptions', compilerOptionsObj)
			.addEntry('include', new JsonArray().addItem('src'))
			.addEntry(
				'references',
				new JsonArray().addItem(
					new JsonObject().addEntry('path', './tsconfig.node.json'),
				),
			);

		return `${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	};

	generateTSConfigNodeJson = (): string => {
		const { tab, newLine } = this.editorConfig;

		const compilerOptionsObj = new JsonObject()
			.addEntry('composite', true)
			.addEntry('module', 'ESNext')
			.addEntry('moduleResolution', 'Node')
			.addEntry('allowSyntheticDefaultImports', true);

		const rootObj = new JsonObject()
			.addEntry('compilerOptions', compilerOptionsObj)
			.addEntry('include', new JsonArray().addItem('vite.config.ts'));

		return `${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	};

	generateIndexHtml = (): string => {
		const { tab } = this.editorConfig;

		const lines: string[] = [];
		lines.push('<!DOCTYPE html>');
		lines.push('<html lang="en">');
		lines.push(`${tab}<head>`);
		lines.push(`${tab}${tab}<meta charset="UTF-8" />`);
		lines.push(
			`${tab}${tab}<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
		);
		lines.push(`${tab}${tab}<title></title>`);
		lines.push(`${tab}</head>`);
		lines.push(`${tab}<body>`);
		lines.push(`${tab}${tab}<div id="root"></div>`);
		lines.push(
			`${tab}${tab}<script type="module" src="/src/main.tsx"></script>`,
		);
		lines.push(`${tab}</body>`);
		lines.push('</html>');
		return this.joinLines(lines);
	};

	generateViteConfigTS = (): string => {
		const { tab, newLine } = this.editorConfig;

		const imports = new JavaScriptImports()
			.addImport(
				new JavaScriptNamedImport('vite').addNamedExport(
					'defineConfig',
				),
			)
			.addImport(
				new JavaScriptDefaultImport('react', '@vitejs/plugin-react'),
			);

		if (
			this.options.outputType === OutputType.ReactLibrary ||
			this.options.configurePathAliases
		) {
			imports.addImport(
				new JavaScriptNamedImport('path').addNamedExport('resolve'),
			);
		}

		if (this.options.outputType === OutputType.ReactLibrary) {
			imports
				.addImport(
					new JavaScriptDefaultImport('dts', 'vite-plugin-dts'),
				)
				// https://rollupjs.org/guide/en/#importing-packagejson
				.addImport(
					new JavaScriptDefaultImport(
						'pkg',
						'./package.json',
						" assert { type: 'json' }",
					),
				);
		}

		const configObj = new JsonObject();

		if (this.options.configurePathAliases) {
			configObj.addEntry(
				'resolve',
				new JsonObject().addEntry(
					'alias',
					new JsonObject().addEntry(
						'@',
						new JsonLiteral(`resolve(__dirname, './src')`),
					),
				),
			);
		}

		const pluginsArray = new JsonArray();

		if (this.options.outputType === OutputType.ReactLibrary) {
			pluginsArray.addItem(
				new JsonLiteral(
					`dts(${new JsonObject()
						.addEntry('insertTypesEntry', true)
						.toFormattedString(
							{
								tab: tab,
								newLine: newLine,
								style: 'JavaScript',
							},
							2,
						)})`,
				),
			);
		}

		if (this.options.outputType === OutputType.ReactLibrary) {
			pluginsArray.addItem(
				new JsonLiteral(
					`react(${new JsonObject()
						// https://miyauchi.dev/ja/posts/lib-vite-tailwindcss/
						.addEntry('jsxRuntime', 'classic')
						.toFormattedString(
							{ tab: tab, newLine: newLine, style: 'JavaScript' },
							2,
						)})`,
				),
			);
		} else {
			pluginsArray.addItem(new JsonLiteral('react()'));
		}

		configObj.addEntry('plugins', pluginsArray);

		if (this.options.outputType === OutputType.ReactLibrary) {
			const buildObj = new JsonObject()
				.addEntry(
					'lib',
					new JsonObject()
						.addEntry(
							'entry',
							new JsonLiteral(
								"resolve(__dirname, 'src/index.ts')",
							),
						)
						.addEntry(
							'formats',
							new JsonArray().addItem('es').addItem('cjs'),
						)
						.addEntry(
							'fileName',
							new JsonLiteral(
								`(format) => \`index.\${format}.js\``,
							),
						),
				)
				.addEntry(
					'rollupOptions',
					// https://rollupjs.org/guide/en/#importing-packagejson
					new JsonObject().addEntry(
						'external',
						new JsonArray()
							.addItem(
								new JsonLiteral(
									'...Object.keys(pkg.peerDependencies ?? [])',
								),
							)
							.addItem(
								new JsonLiteral(
									'...Object.keys(pkg.dependencies ?? [])',
								),
							),
					),
				)
				.addEntry('sourcemap', true);

			configObj.addEntry('build', buildObj);
		}

		const lines: string[] = [];
		lines.push(`${imports.toFormattedString({ newLine })}`);
		lines.push('');
		lines.push('// https://vitejs.dev/config/');
		lines.push(
			`export default defineConfig(${configObj.toFormattedString({
				tab: tab,
				newLine: newLine,
				style: 'JavaScript',
			})});`,
		);
		return this.joinLines(lines);
	};

	generateSrcAppTsx = (): string => {
		const { tab, newLine } = this.editorConfig;

		const imports = new JavaScriptImports().addImport(
			new JavaScriptDefaultImport('React', 'react'),
		);

		const lines: string[] = [];
		lines.push(`${imports.toFormattedString({ newLine })}`);
		lines.push('');
		lines.push('const App = (): React.ReactElement => {');
		lines.push(`${tab}return <></>;`);
		lines.push('};');
		lines.push('');
		lines.push('export default App;');
		return this.joinLines(lines);
	};

	generateSrcMainTsx = (): string => {
		const { tab, newLine } = this.editorConfig;

		const imports = new JavaScriptImports()
			.addImport(
				new JavaScriptDefaultImport(
					'App',
					this.options.configurePathAliases ? '@/App' : './App',
				),
			)
			.addImport(new JavaScriptDefaultImport('React', 'react'))
			.addImport(
				new JavaScriptDefaultImport('ReactDOM', 'react-dom/client'),
			);

		const lines: string[] = [];
		lines.push(`${imports.toFormattedString({ newLine })}`);
		lines.push('');
		lines.push(
			`ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(`,
		);
		lines.push(`${tab}<React.StrictMode>`);
		lines.push(`${tab}${tab}<App />`);
		lines.push(`${tab}</React.StrictMode>,`);
		lines.push(');');
		return this.joinLines(lines);
	};

	generateSrcViteEnvDTS = (): string => {
		const lines: string[] = [];
		lines.push('/// <reference types="vite/client" />');
		return this.joinLines(lines);
	};

	*generateProjectFiles(): Generator<ProjectFile> {
		yield {
			path: '.editorconfig',
			text: new EditorConfigGenerator(this.editorConfig).generate(),
		};

		if (this.options.enablePrettier) {
			yield {
				path: '.prettierrc.json',
				text: new PrettierRcJsonGenerator(this.editorConfig, {
					sortImports: this.options.sortImports,
				}).generate(),
			};
		}

		yield {
			path: '.gitignore',
			text: new ReactGitignoreGenerator(this.editorConfig).generate(),
		};
		yield {
			path: 'package.json',
			text: this.generatePackageJson(),
		};
		yield {
			path: 'tsconfig.json',
			text: this.generateTSConfigJson(),
		};
		yield {
			path: 'tsconfig.node.json',
			text: this.generateTSConfigNodeJson(),
		};

		if (this.options.enableESLint) {
			yield {
				path: '.eslintrc.cjs',
				text: new ESLintRcCjsGenerator(this.editorConfig, {
					extendsReactApp: true,
				}).generate(),
			};
		}

		yield {
			path: 'index.html',
			text: this.generateIndexHtml(),
		};
		yield {
			path: 'vite.config.ts',
			text: this.generateViteConfigTS(),
		};
		yield {
			path: 'src/App.tsx',
			text: this.generateSrcAppTsx(),
		};
		yield {
			path: 'src/main.tsx',
			text: this.generateSrcMainTsx(),
		};
		yield {
			path: 'src/vite-env.d.ts',
			text: this.generateSrcViteEnvDTS(),
		};
	}
}
