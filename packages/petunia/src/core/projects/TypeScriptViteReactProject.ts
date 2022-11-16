import {
	JavaScriptDefaultImport,
	JavaScriptImports,
	JavaScriptNamedImport,
} from '@/core/JavaScriptImport';
import { JsonArray, JsonLiteral, JsonObject } from '@/core/JsonValue';
import { Project, ProjectFile } from '@/core/projects/Project';
import { generateEditorConfig } from '@/core/projects/generateEditorConfig';
import { generatePrettierRcJson } from '@/core/projects/generatePrettierRcJson';
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

		const dependencies = new JsonObject()
			.addEntry('react', '^18.2.0')
			.addEntry('react-dom', '^18.2.0');

		const devDependencies = new JsonObject()
			.addEntry('@types/react', '^18.0.24')
			.addEntry('@types/react-dom', '^18.0.8')
			.addEntry('@vitejs/plugin-react', '^2.2.0')
			.addEntry('typescript', '^4.6.4')
			.addEntry('vite', '^3.2.3');

		if (this.options.useAjv) {
			dependencies.addEntry('ajv', '^8.11.2');
		}

		if (this.options.useLodash) {
			dependencies.addEntry('lodash-es', '^4.17.21');
			devDependencies.addEntry('@types/lodash-es', '^4.17.6');
		}

		if (this.options.useMobX) {
			dependencies.addEntry('mobx', '^6.7.0');
			dependencies.addEntry('mobx-react-lite', '^3.4.0');
		}

		if (this.options.useQs) {
			dependencies.addEntry('qs', '^6.11.0');
			devDependencies.addEntry('@types/qs', '^6.9.7');
		}

		if (this.options.useReactRouter) {
			dependencies.addEntry('react-router-dom', '^6.4.3');
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

		const configObj = new JsonObject().addEntry(
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
			text: generateEditorConfig(this.editorConfig),
		};

		if (this.options.enablePrettier) {
			yield {
				path: '.prettierrc.json',
				text: generatePrettierRcJson(this.editorConfig),
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
