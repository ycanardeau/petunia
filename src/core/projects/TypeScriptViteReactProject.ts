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
import validate from 'validate-npm-package-name';

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

		const dependenciesObj = new PackageJsonDependency()
			.addPackage('react')
			.addPackage('react-dom');

		const devDependenciesObj = new PackageJsonDependency()
			.addPackage('@types/react')
			.addPackage('@types/react-dom')
			.addPackage('@vitejs/plugin-react')
			.addPackage('typescript')
			.addPackage('vite');

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

		if (this.options.useAjv) {
			dependenciesObj.addPackage('ajv');
		}

		if (this.options.useLodash) {
			dependenciesObj.addPackage('lodash-es');
			devDependenciesObj.addPackage('@types/lodash-es');
		}

		if (this.options.useMobX) {
			dependenciesObj.addPackage('mobx');
			dependenciesObj.addPackage('mobx-react-lite');
		}

		if (this.options.useQs) {
			dependenciesObj.addPackage('qs');
			devDependenciesObj.addPackage('@types/qs');
		}

		if (this.options.useReactRouter) {
			dependenciesObj.addPackage('react-router-dom');
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
			.addEntry('dependencies', dependenciesObj.orderByKey())
			.addEntry('devDependencies', devDependenciesObj.orderByKey());

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
				new JavaScriptDefaultImport('@vitejs/plugin-react', 'react'),
			);

		if (this.options.configurePathAliases) {
			imports.addImport(
				new JavaScriptNamedImport('path').addNamedExport('resolve'),
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

		configObj.addEntry(
			'plugins',
			new JsonArray().addItem(new JsonLiteral('react()')),
		);

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
			new JavaScriptDefaultImport('react', 'React'),
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
					this.options.configurePathAliases ? '@/App' : './App',
					'App',
				),
			)
			.addImport(new JavaScriptDefaultImport('react', 'React'))
			.addImport(
				new JavaScriptDefaultImport('react-dom/client', 'ReactDOM'),
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
