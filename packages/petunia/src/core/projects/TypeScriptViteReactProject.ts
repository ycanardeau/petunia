import {
	JavaScriptDefaultImport,
	JavaScriptImports,
	JavaScriptNamedImport,
} from '@/core/JavaScriptImport';
import { JsonArray, JsonLiteral, JsonObject } from '@/core/JsonValue';
import { PackageJsonDependency } from '@/core/projects/PackageJsonDependency';
import { Project, ProjectFile } from '@/core/projects/Project';
import {
	IconLibrary,
	TestingFramework,
	UIFramework,
} from '@/stores/ProjectCreateStore';

interface TypeScriptViteReactProjectOptions {
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
	generateEditorConfig = (): string => {
		const { newLine } = this.editorConfig;

		const result: string[] = [];
		result.push('root = true');
		result.push('');
		result.push('[*]');
		result.push('end_of_line = lf');
		result.push('charset = utf-8');
		result.push('trim_trailing_whitespace = true');
		result.push('insert_final_newline = true');
		result.push('indent_style = tab');
		result.push('indent_size = 4');
		return `${result.join(newLine)}${newLine}`;
	};

	generatePrettierRcJson = (): string => {
		const { tab, newLine } = this.editorConfig;

		const obj = new JsonObject()
			.addEntry('singleQuote', true)
			.addEntry('trailingComma', 'all');

		if (this.options.sortImports) {
			obj.addEntry(
				'importOrder',
				new JsonArray()
					.addItem('^@core/(.*)$')
					.addItem('^@server/(.*)$')
					.addItem('^@ui/(.*)$')
					.addItem('^[./]'),
			)
				.addEntry('importOrderSeparation', true)
				.addEntry('importOrderSortSpecifiers', true);
		}

		return `${obj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	};

	generateGitignore = (): string => {
		const { newLine } = this.editorConfig;

		const result: string[] = [];
		result.push('# Logs');
		result.push('logs');
		result.push('*.log');
		result.push('npm-debug.log*');
		result.push('yarn-debug.log*');
		result.push('yarn-error.log*');
		result.push('pnpm-debug.log*');
		result.push('lerna-debug.log*');
		result.push('');
		result.push('node_modules');
		result.push('dist');
		result.push('dist-ssr');
		result.push('*.local');
		result.push('');
		result.push('# Editor directories and files');
		result.push('.vscode/*');
		result.push('!.vscode/extensions.json');
		result.push('.idea');
		result.push('.DS_Store');
		result.push('*.suo');
		result.push('*.ntvs*');
		result.push('*.njsproj');
		result.push('*.sln');
		result.push('*.sw?');
		return `${result.join(newLine)}${newLine}`;
	};

	generatePackageJson = (): string => {
		const { tab, newLine } = this.editorConfig;

		const dependencies = new PackageJsonDependency()
			.addPackage('react')
			.addPackage('react-dom');

		const devDependencies = new PackageJsonDependency()
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
				devDependencies.addPackage('vitest');
				break;
		}

		switch (this.options.ui) {
			case UIFramework.None:
				// nop
				break;

			case UIFramework.ElasticUI:
				dependencies.addPackage('@elastic/eui');
				dependencies.addPackage('@elastic/datemath');
				dependencies.addPackage('@emotion/react');
				dependencies.addPackage('@emotion/css');
				dependencies.addPackage('moment');
				dependencies.addPackage('prop-types');
				break;
		}

		switch (this.options.icon) {
			case IconLibrary.None:
				// nop
				break;

			case IconLibrary.FluentSystemIcons:
				dependencies.addPackage('@fluentui/react-icons');
				break;
		}

		if (this.options.enablePrettier) {
			devDependencies.addPackage('prettier');
		}

		if (this.options.sortImports) {
			devDependencies.addPackage('@trivago/prettier-plugin-sort-imports');
		}

		if (this.options.enableESLint) {
			devDependencies.addPackage('@typescript-eslint/eslint-plugin');
			devDependencies.addPackage('@typescript-eslint/parser');
			devDependencies.addPackage('eslint');
			devDependencies.addPackage('eslint-config-react-app');
			devDependencies.addPackage('eslint-plugin-flowtype');
			devDependencies.addPackage('eslint-plugin-import');
			devDependencies.addPackage('eslint-plugin-jsx-a11y');
			devDependencies.addPackage('eslint-plugin-react');
			devDependencies.addPackage('eslint-plugin-react-hooks');
		}

		if (this.options.enablePrettier && this.options.enableESLint) {
			devDependencies.addPackage('eslint-config-prettier');
			devDependencies.addPackage('eslint-plugin-prettier');
		}

		if (this.options.useAjv) {
			dependencies.addPackage('ajv');
		}

		if (this.options.useLodash) {
			dependencies.addPackage('lodash-es');
			devDependencies.addPackage('@types/lodash-es');
		}

		if (this.options.useMobX) {
			dependencies.addPackage('mobx');
			dependencies.addPackage('mobx-react-lite');
		}

		if (this.options.useQs) {
			dependencies.addPackage('qs');
			devDependencies.addPackage('@types/qs');
		}

		if (this.options.useReactRouter) {
			dependencies.addPackage('react-router-dom');
		}

		const obj = new JsonObject()
			.addEntry('name', 'petunia')
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
			.addEntry('dependencies', dependencies.orderByKey())
			.addEntry('devDependencies', devDependencies.orderByKey());

		return `${obj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	};

	generateTSConfigJson = (): string => {
		const { tab, newLine } = this.editorConfig;

		const compilerOptions = new JsonObject()
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
			compilerOptions.addEntry('baseUrl', './');
			compilerOptions.addEntry(
				'paths',
				new JsonObject().addEntry(
					'@/*',
					new JsonArray().addItem('src/*'),
				),
			);
		}

		if (this.options.useMobX) {
			compilerOptions.addEntry('experimentalDecorators', true);
		}

		const obj = new JsonObject()
			.addEntry('compilerOptions', compilerOptions)
			.addEntry('include', new JsonArray().addItem('src'))
			.addEntry(
				'references',
				new JsonArray().addItem(
					new JsonObject().addEntry('path', './tsconfig.node.json'),
				),
			);

		return `${obj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	};

	generateTSConfigNodeJson = (): string => {
		const { tab, newLine } = this.editorConfig;

		const compilerOptions = new JsonObject()
			.addEntry('composite', true)
			.addEntry('module', 'ESNext')
			.addEntry('moduleResolution', 'Node')
			.addEntry('allowSyntheticDefaultImports', true);

		const obj = new JsonObject()
			.addEntry('compilerOptions', compilerOptions)
			.addEntry('include', new JsonArray().addItem('vite.config.ts'));

		return `${obj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	};

	generateESLintRcJS = (): string => {
		const { tab, newLine } = this.editorConfig;

		const obj = new JsonObject()
			.addEntry('parser', '@typescript-eslint/parser')
			.addEntry(
				'parserOptions',
				new JsonObject()
					.addEntry('project', 'tsconfig.json')
					.addEntry('sourceType', 'module')
					.addEntry('tsconfigRootDir', new JsonLiteral('__dirname')),
			)
			.addEntry(
				'plugins',
				new JsonArray().addItem('@typescript-eslint/eslint-plugin'),
			)
			.addEntry(
				'extends',
				new JsonArray()
					.addItem('plugin:@typescript-eslint/recommended')
					.addItem('plugin:prettier/recommended'),
			)
			.addEntry('root', true)
			.addEntry(
				'env',
				new JsonObject().addEntry('node', true).addEntry('jest', true),
			)
			.addEntry('ignorePatterns', new JsonArray().addItem('.eslintrc.js'))
			.addEntry(
				'rules',
				new JsonObject()
					.addEntry('@typescript-eslint/interface-name-prefix', 'off')
					.addEntry(
						'@typescript-eslint/explicit-function-return-type',
						'error',
					)
					.addEntry(
						'@typescript-eslint/explicit-module-boundary-types',
						'off',
					)
					.addEntry('@typescript-eslint/no-explicit-any', 'off')
					.addEntry('@typescript-eslint/no-empty-function', 'off'),
			);

		return `module.exports = ${obj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'JavaScript',
		})};${newLine}`;
	};

	generateIndexHtml = (): string => {
		const { tab, newLine } = this.editorConfig;

		const result: string[] = [];
		result.push('<!DOCTYPE html>');
		result.push('<html lang="en">');
		result.push(`${tab}<head>`);
		result.push(`${tab}${tab}<meta charset="UTF-8" />`);
		result.push(
			`${tab}${tab}<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
		);
		result.push(`${tab}${tab}<title></title>`);
		result.push(`${tab}</head>`);
		result.push(`${tab}<body>`);
		result.push(`${tab}${tab}<div id="root"></div>`);
		result.push(
			`${tab}${tab}<script type="module" src="/src/main.tsx"></script>`,
		);
		result.push(`${tab}</body>`);
		result.push('</html>');
		return `${result.join(newLine)}${newLine}`;
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

		const result: string[] = [];
		result.push(`${imports.toFormattedString({ newLine })}`);
		result.push('');
		result.push('// https://vitejs.dev/config/');
		result.push(
			`export default defineConfig(${configObj.toFormattedString({
				tab: tab,
				newLine: newLine,
				style: 'JavaScript',
			})});`,
		);
		return `${result.join(newLine)}${newLine}`;
	};

	generateSrcAppTsx = (): string => {
		const { tab, newLine } = this.editorConfig;

		const imports = new JavaScriptImports().addImport(
			new JavaScriptDefaultImport('react', 'React'),
		);

		const result: string[] = [];
		result.push(`${imports.toFormattedString({ newLine })}`);
		result.push('');
		result.push('const App = (): React.ReactElement => {');
		result.push(`${tab}return <></>;`);
		result.push('};');
		result.push('');
		result.push('export default App;');
		return `${result.join(newLine)}${newLine}`;
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

		const result: string[] = [];
		result.push(`${imports.toFormattedString({ newLine })}`);
		result.push('');
		result.push(
			`ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(`,
		);
		result.push(`${tab}<React.StrictMode>`);
		result.push(`${tab}${tab}<App />`);
		result.push(`${tab}</React.StrictMode>,`);
		result.push(');');
		return `${result.join(newLine)}${newLine}`;
	};

	generateSrcViteEnvDTS = (): string => {
		const { newLine } = this.editorConfig;

		const result: string[] = [];
		result.push('/// <reference types="vite/client" />');
		return `${result.join(newLine)}${newLine}`;
	};

	*generateProjectFiles(): Generator<ProjectFile> {
		yield {
			path: '.editorconfig',
			text: this.generateEditorConfig(),
		};

		if (this.options.enablePrettier) {
			yield {
				path: '.prettierrc.json',
				text: this.generatePrettierRcJson(),
			};
		}

		yield {
			path: '.gitignore',
			text: this.generateGitignore(),
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
				path: '.eslintrc.js',
				text: this.generateESLintRcJS(),
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
