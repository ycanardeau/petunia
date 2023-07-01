import { JavaScriptImports } from '@/core/JavaScriptImport';
import { JsonArray, JsonLiteral, JsonObject } from '@/core/JsonValue';
import { PackageJsonDependency } from '@/core/projects/PackageJsonDependency';
import { ProjectFile } from '@/core/projects/Project';
import { ReactGitignoreGenerator } from '@/core/projects/ReactGitignoreGenerator';
import {
	TestingFramework,
	TypeScriptProject,
	TypeScriptProjectOptions,
} from '@/core/projects/TypeScriptProject';
import dependencies from '@/core/projects/dependencies.json' assert { type: 'json' };
import validate from 'validate-npm-package-name';

export enum OutputType {
	ReactApplication = 'ReactApplication',
	ReactLibrary = 'ReactLibrary',
}

export enum UIFramework {
	None = 'None',
	ElasticUI = 'ElasticUI',
}

export enum IconLibrary {
	None = 'None',
	FluentSystemIcons = 'FluentSystemIcons',
}

interface TypeScriptViteReactProjectOptions extends TypeScriptProjectOptions {
	outputType?: OutputType;
	ui?: UIFramework;
	icon?: IconLibrary;
	useMobX?: boolean;
	useReactRouter?: boolean;
	useSwc?: boolean;
}

export class TypeScriptViteReactProject extends TypeScriptProject<TypeScriptViteReactProjectOptions> {
	get isReactProject(): boolean {
		return true;
	}

	generatePackageJson(): string {
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
			.addPackage(
				'typescript',
				// TODO: remove
				this.options.ui === UIFramework.ElasticUI
					? '^4.5.3'
					: undefined,
			)
			.addPackage('vite');

		if (this.options.useSwc) {
			devDependenciesObj.addPackage('@vitejs/plugin-react-swc');
		} else {
			devDependenciesObj.addPackage('@vitejs/plugin-react');
		}

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
				dependenciesObj
					.addPackage('@elastic/eui')
					.addPackage('@elastic/datemath')
					.addPackage('@emotion/react')
					.addPackage('@emotion/css')
					.addPackage('moment')
					.addPackage('prop-types');
				devDependenciesObj.addPackage('utility-types');
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
	}

	generateTSConfigJson(): string {
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
	}

	generateTSConfigNodeJson(): string {
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
	}

	generateIndexHtml(): string {
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

		if (this.options.ui === UIFramework.ElasticUI) {
			lines.push(`${tab}${tab}<meta name="eui-style-insert" />`);
		}

		lines.push(`${tab}</head>`);
		lines.push(`${tab}<body>`);
		lines.push(`${tab}${tab}<div id="root"></div>`);
		lines.push(
			`${tab}${tab}<script type="module" src="/src/main.tsx"></script>`,
		);
		lines.push(`${tab}</body>`);
		lines.push('</html>');
		return this.joinLines(lines);
	}

	generateViteConfigTS(): string {
		const { tab, newLine } = this.editorConfig;

		const imports = new JavaScriptImports()
			.addNamedImport('vite', (builder) =>
				builder.addNamedExport('defineConfig'),
			)
			.addDefaultImport(
				'react',
				this.options.useSwc
					? '@vitejs/plugin-react-swc'
					: '@vitejs/plugin-react',
			);

		if (
			this.options.outputType === OutputType.ReactLibrary ||
			this.options.configurePathAliases
		) {
			imports.addNamedImport('path', (builder) =>
				builder.addNamedExport('resolve'),
			);
		}

		if (this.options.outputType === OutputType.ReactLibrary) {
			imports
				.addDefaultImport('dts', 'vite-plugin-dts')
				// https://rollupjs.org/guide/en/#importing-packagejson
				.addDefaultImport(
					'pkg',
					'./package.json',
					" assert { type: 'json' }",
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

		if (this.options.ui === UIFramework.ElasticUI) {
			configObj.addEntry(
				'build',
				new JsonObject().addEntry(
					'dynamicImportVarsOptions',
					new JsonObject().addEntry('exclude', new JsonArray()),
				),
			);
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
	}

	generateSrcAppTsx(): string {
		const { tab, newLine } = this.editorConfig;

		const imports = new JavaScriptImports().addDefaultImport(
			'React',
			'react',
		);

		if (this.options.ui === UIFramework.ElasticUI) {
			imports.addModuleNameImport('@/icons');
			imports.addNamedImport('@elastic/eui', (builder) => {
				builder.addNamedExport('EuiProvider');
			});
			imports.addModuleNameImport('@elastic/eui/dist/eui_theme_dark.css');
			imports.addDefaultImport('createCache', '@emotion/cache');
		}

		const lines: string[] = [];
		lines.push(`${imports.toFormattedString({ newLine })}`);

		if (this.options.ui === UIFramework.ElasticUI) {
			lines.push('');
			lines.push('// https://elastic.github.io/eui/#/utilities/provider');
			lines.push('const euiCache = createCache({');
			lines.push(`${tab}key: 'eui',`);
			lines.push(
				`${tab}container: document.querySelector('meta[name="eui-style-insert"]') as Node,`,
			);
			lines.push('});');
			lines.push('euiCache.compat = true;');
		}

		lines.push('');
		lines.push('const App = (): React.ReactElement => {');

		if (this.options.ui === UIFramework.ElasticUI) {
			lines.push(
				`${tab}return <EuiProvider colorMode="dark" cache={euiCache}></EuiProvider>;`,
			);
		} else {
			lines.push(`${tab}return <></>;`);
		}

		lines.push('};');
		lines.push('');
		lines.push('export default App;');
		return this.joinLines(lines);
	}

	generateSrcGlobalDTS(): string {
		return `// https://github.com/elastic/eui/issues/5463#issuecomment-1107665339
declare module '@elastic/eui/es/components/icon/*';
`;
	}

	generateSrcIconsTs(): string {
		return `// https://github.com/elastic/eui/issues/5463#issuecomment-1107665339
import { ICON_TYPES } from '@elastic/eui';
import { icon as alert } from '@elastic/eui/es/components/icon/assets/alert';
import { icon as apps } from '@elastic/eui/es/components/icon/assets/apps';
import { icon as arrowEnd } from '@elastic/eui/es/components/icon/assets/arrowEnd';
import { icon as arrowStart } from '@elastic/eui/es/components/icon/assets/arrowStart';
import { icon as arrowDown } from '@elastic/eui/es/components/icon/assets/arrow_down';
import { icon as arrowLeft } from '@elastic/eui/es/components/icon/assets/arrow_left';
import { icon as arrowRight } from '@elastic/eui/es/components/icon/assets/arrow_right';
import { icon as cross } from '@elastic/eui/es/components/icon/assets/cross';
import { icon as editorBold } from '@elastic/eui/es/components/icon/assets/editor_bold';
import { icon as editorChecklist } from '@elastic/eui/es/components/icon/assets/editor_checklist';
import { icon as editorCodeBlock } from '@elastic/eui/es/components/icon/assets/editor_code_block';
import { icon as editorComment } from '@elastic/eui/es/components/icon/assets/editor_comment';
import { icon as editorItalic } from '@elastic/eui/es/components/icon/assets/editor_italic';
import { icon as editorLink } from '@elastic/eui/es/components/icon/assets/editor_link';
import { icon as editorOrderedList } from '@elastic/eui/es/components/icon/assets/editor_ordered_list';
import { icon as editorUnorderedList } from '@elastic/eui/es/components/icon/assets/editor_unordered_list';
import { icon as empty } from '@elastic/eui/es/components/icon/assets/empty';
import { icon as eye } from '@elastic/eui/es/components/icon/assets/eye';
import { icon as logoGithub } from '@elastic/eui/es/components/icon/assets/logo_github';
import { icon as questionInCircle } from '@elastic/eui/es/components/icon/assets/question_in_circle';
import { icon as quote } from '@elastic/eui/es/components/icon/assets/quote';
import { icon as returnKey } from '@elastic/eui/es/components/icon/assets/return_key';
import { icon as search } from '@elastic/eui/es/components/icon/assets/search';
import { icon as sortDown } from '@elastic/eui/es/components/icon/assets/sort_down';
import { icon as sortUp } from '@elastic/eui/es/components/icon/assets/sort_up';
import { icon as userAvatar } from '@elastic/eui/es/components/icon/assets/userAvatar';
import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon';
import { ValuesType } from 'utility-types';

type IconComponentNameType = ValuesType<typeof ICON_TYPES>;
type IconComponentCacheType = Partial<Record<IconComponentNameType, unknown>>;

const cachedIcons: IconComponentCacheType = {
	alert,
	apps,
	arrowDown,
	arrowEnd,
	arrowLeft,
	arrowRight,
	arrowStart,
	cross,
	editorBold,
	editorChecklist,
	editorComment,
	editorCodeBlock,
	editorItalic,
	editorLink,
	editorOrderedList,
	editorUnorderedList,
	empty,
	eye,
	logoGithub,
	questionInCircle,
	quote,
	returnKey,
	search,
	sortDown,
	sortUp,
	userAvatar,
};

appendIconComponentCache(cachedIcons);
`;
	}

	generateSrcMainTsx(): string {
		const reactVersion = 17 as 17 | 18; /* TODO */
		switch (reactVersion) {
			case 17:
				const { tab, newLine } = this.editorConfig;

				const imports = new JavaScriptImports()
					.addDefaultImport(
						'App',
						this.options.configurePathAliases ? '@/App' : './App',
					)
					.addDefaultImport('React', 'react')
					.addDefaultImport('ReactDOM', 'react-dom');

				const lines: string[] = [];
				lines.push(`${imports.toFormattedString({ newLine })}`);
				lines.push('');
				lines.push(`ReactDOM.render(`);
				lines.push(`${tab}<React.StrictMode>`);
				lines.push(`${tab}${tab}<App />`);
				lines.push(`${tab}</React.StrictMode>,`);
				lines.push(
					`${tab}document.getElementById('root') as HTMLElement,`,
				);
				lines.push(');');
				return this.joinLines(lines);

			case 18: {
				const { tab, newLine } = this.editorConfig;

				const imports = new JavaScriptImports()
					.addDefaultImport(
						'App',
						this.options.configurePathAliases ? '@/App' : './App',
					)
					.addDefaultImport('React', 'react')
					.addDefaultImport('ReactDOM', 'react-dom/client');

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
			}
		}
	}

	generateSrcViteEnvDTS(): string {
		const lines: string[] = [];
		lines.push('/// <reference types="vite/client" />');
		return this.joinLines(lines);
	}

	*generateProjectFiles(): Generator<ProjectFile> {
		yield* super.generateProjectFiles();

		yield {
			path: '.gitignore',
			text: new ReactGitignoreGenerator(this.editorConfig, {}).generate(),
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

		if (this.options.ui === UIFramework.ElasticUI) {
			yield {
				path: 'src/global.d.ts',
				text: this.generateSrcGlobalDTS(),
			};
			yield {
				path: 'src/icons.ts',
				text: this.generateSrcIconsTs(),
			};
		}
	}
}
