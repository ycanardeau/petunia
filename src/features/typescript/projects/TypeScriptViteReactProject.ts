import { JavaScriptImports } from '@/core/JavaScriptImport';
import { JsonArray, JsonLiteral, JsonObject } from '@/core/JsonValue';
import { PackageJsonDependency } from '@/features/common/projects/PackageJsonDependency';
import { ProjectFile } from '@/features/common/projects/Project';
import dependencies from '@/features/common/projects/dependencies.json' assert { type: 'json' };
import { PackageManager } from '@/features/typescript/projects/PackageManager';
import { ReactGitignoreGenerator } from '@/features/typescript/projects/ReactGitignoreGenerator';
import {
	TestingFramework,
	TypeScriptProject,
	TypeScriptProjectOptions,
} from '@/features/typescript/projects/TypeScriptProject';
import validate from 'validate-npm-package-name';

export type ReactMajorVersion = 17 | 18;

export enum OutputType {
	ReactApplication = 'ReactApplication',
	ReactLibrary = 'ReactLibrary',
	VueApplication = 'VueApplication',
	VueLibrary = 'VueLibrary',
}

export enum UIFramework {
	None = 'None',
	ElasticUI = 'ElasticUI',
	Bootstrap = 'Bootstrap',
	Mantine = 'Mantine',
}

export enum IconLibrary {
	None = 'None',
	FluentSystemIcons = 'FluentSystemIcons',
}

interface TypeScriptViteReactProjectOptions extends TypeScriptProjectOptions {
	reactMajorVersion?: ReactMajorVersion;
	outputType?: OutputType;
	ui?: UIFramework;
	icon?: IconLibrary;
	useMobX?: boolean;
	useReactRouter?: boolean;
	useSwc?: boolean;
	useRouteSphere?: boolean;
	generateStores?: boolean;
	configureCustomProxyRules?: boolean;
	useHttps?: boolean;
	generateDockerfile?: boolean;
	publicBasePath?: string;
}

export class TypeScriptViteReactProject extends TypeScriptProject<TypeScriptViteReactProjectOptions> {
	get isReactProject(): boolean {
		switch (this.options.outputType) {
			case OutputType.ReactApplication:
			case OutputType.ReactLibrary:
			case undefined:
				return true;

			case OutputType.VueApplication:
			case OutputType.VueLibrary:
				return false;

			default:
				throw new Error(
					`Invalid outputType: ${this.options.outputType}`,
				);
		}
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
			.addPackage('@types/node')
			.addPackage('typescript')
			.addPackage('vite');

		const peerDependenciesObj = new PackageJsonDependency();

		switch (this.options.outputType) {
			case OutputType.ReactApplication:
			case OutputType.ReactLibrary:
			case undefined:
				switch (this.options.reactMajorVersion) {
					case 17:
					default:
						devDependenciesObj
							.addPackage('@types/react', '^17.0.39')
							.addPackage('@types/react-dom', '^17.0.11');

						switch (this.options.outputType) {
							case OutputType.ReactApplication:
							case undefined:
								dependenciesObj
									.addPackage('react', '^17.0.2')
									.addPackage('react-dom', '^17.0.2');
								break;

							case OutputType.ReactLibrary:
								devDependenciesObj
									.addPackage('react', '^17.0.2')
									.addPackage('react-dom', '^17.0.2')
									.addPackage('vite-plugin-dts');
								peerDependenciesObj
									.addPackage('react', '^17.0.2')
									.addPackage('react-dom', '^17.0.2');
								break;
						}
						break;

					case 18:
						devDependenciesObj
							.addPackage('@types/react')
							.addPackage('@types/react-dom');

						switch (this.options.outputType) {
							case OutputType.ReactApplication:
							case undefined:
								dependenciesObj
									.addPackage('react')
									.addPackage('react-dom');
								break;

							case OutputType.ReactLibrary:
								devDependenciesObj
									.addPackage('react')
									.addPackage('react-dom')
									.addPackage('vite-plugin-dts');
								peerDependenciesObj
									.addPackage('react')
									.addPackage('react-dom');
								break;
						}
						break;
				}
				break;

			case OutputType.VueApplication:
			case OutputType.VueLibrary:
				dependenciesObj.addPackage('vue');
				devDependenciesObj.addPackage('vue-tsc');
				break;
		}

		switch (this.options.outputType) {
			case OutputType.ReactApplication:
			case OutputType.ReactLibrary:
			case undefined:
				if (this.options.useSwc) {
					devDependenciesObj.addPackage('@vitejs/plugin-react-swc');
				} else {
					devDependenciesObj.addPackage('@vitejs/plugin-react');
				}
				break;

			case OutputType.VueApplication:
			case OutputType.VueLibrary:
				devDependenciesObj.addPackage('@vitejs/plugin-vue');
				break;
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
					.addPackage('@emotion/cache')
					.addPackage('moment')
					.addPackage('prop-types');
				devDependenciesObj.addPackage('utility-types');
				break;

			case UIFramework.Bootstrap:
				dependenciesObj
					.addPackage('react-bootstrap')
					.addPackage('bootstrap');
				devDependenciesObj.addPackage('sass');
				break;

			case UIFramework.Mantine:
				dependenciesObj
					.addPackage('@mantine/hooks')
					.addPackage('@mantine/core');
				/* TODO: devDependenciesObj
					.addPackage('postcss')
					.addPackage('postcss-preset-mantine')
					.addPackage('postcss-simple-vars'); */
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
					'eslint-plugin-simple-import-sort',
				);
			}
		}

		if (this.options.enableESLint) {
			devDependenciesObj.addPackage('@typescript-eslint/eslint-plugin');
			devDependenciesObj.addPackage('@typescript-eslint/parser');
			devDependenciesObj.addPackage('eslint');
			devDependenciesObj.addPackage('eslint-plugin-flowtype');
			devDependenciesObj.addPackage('eslint-plugin-import');
			devDependenciesObj.addPackage('eslint-plugin-jsx-a11y');

			switch (this.options.outputType) {
				case OutputType.ReactApplication:
				case OutputType.ReactLibrary:
				case undefined:
					devDependenciesObj.addPackage('eslint-config-react-app');
					devDependenciesObj.addPackage('eslint-plugin-react');
					devDependenciesObj.addPackage('eslint-plugin-react-hooks');
					break;
			}
		}

		if (this.options.enablePrettier && this.options.enableESLint) {
			devDependenciesObj.addPackage('eslint-config-prettier');
			devDependenciesObj.addPackage('eslint-plugin-prettier');
		}

		const addAdditionalPackage = (
			name: keyof typeof dependencies,
		): void => {
			switch (this.options.outputType) {
				case OutputType.ReactApplication:
				case OutputType.VueApplication:
				case undefined:
					dependenciesObj.addPackage(name);
					break;

				case OutputType.ReactLibrary:
				case OutputType.VueLibrary:
					devDependenciesObj.addPackage(name);
					peerDependenciesObj.addPackage(name);
					break;
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

		if (this.options.useRouteSphere) {
			addAdditionalPackage('@aigamo/route-sphere');
		}

		if (this.options.useHttps) {
			devDependenciesObj.addPackage('@vitejs/plugin-basic-ssl');
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
							.addEntry(
								'import',
								new JsonObject()
									.addEntry('types', './dist/index.d.ts')
									.addEntry('default', esFilename),
							)
							.addEntry(
								'require',
								new JsonObject()
									.addEntry('types', './dist/index.d.ts')
									.addEntry('default', cjsFilename),
							),
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
			.addEntry('noEmit', true);

		switch (this.options.outputType) {
			case OutputType.ReactApplication:
			case OutputType.ReactLibrary:
			case undefined:
				compilerOptionsObj.addEntry('jsx', 'react-jsx');
				break;

			case OutputType.VueApplication:
			case OutputType.VueLibrary:
				compilerOptionsObj.addEntry('jsx', 'preserve');
				break;
		}

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

		switch (this.options.outputType) {
			case OutputType.ReactApplication:
			case OutputType.ReactLibrary:
			case undefined:
				lines.push(
					`${tab}${tab}<script type="module" src="/src/main.tsx"></script>`,
				);
				break;

			case OutputType.VueApplication:
			case OutputType.VueLibrary:
				lines.push(
					`${tab}${tab}<script type="module" src="/src/main.ts"></script>`,
				);
				break;
		}

		lines.push(`${tab}</body>`);
		lines.push('</html>');
		return this.joinLines(lines);
	}

	generateViteConfigTS(): string {
		const { tab, newLine } = this.editorConfig;

		const imports = new JavaScriptImports().addNamedImport(
			'vite',
			(builder) => builder.addNamedExport('defineConfig'),
		);

		switch (this.options.outputType) {
			case OutputType.ReactApplication:
			case OutputType.ReactLibrary:
			case undefined:
				imports.addDefaultImport(
					'react',
					this.options.useSwc
						? '@vitejs/plugin-react-swc'
						: '@vitejs/plugin-react',
				);
				break;

			case OutputType.VueApplication:
			case OutputType.VueLibrary:
				imports.addDefaultImport('vue', '@vitejs/plugin-vue');
				break;
		}

		if (
			this.options.outputType === OutputType.ReactLibrary ||
			this.options.configurePathAliases
		) {
			imports.addNamedImport('node:path', (builder) =>
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

		if (this.options.useRouteSphere) {
			imports
				.addDefaultImport('Ajv', 'ajv')
				.addDefaultImport('ajvGenerate', 'ajv/dist/standalone')
				.addDefaultImport('fs', 'node:fs')
				.addNamedImport('node:path', (builder) => {
					builder.addNamedExport('join');
				})
				.addNamedImport('vite', (builder) => {
					builder.addNamedExport('PluginOption');
				});
		}

		if (this.options.useHttps) {
			imports.addDefaultImport('basicSsl', '@vitejs/plugin-basic-ssl');
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

		switch (this.options.outputType) {
			case OutputType.ReactApplication:
			case undefined:
				pluginsArray.addItem(new JsonLiteral('react()'));

				if (this.options.useRouteSphere) {
					pluginsArray.addItem(
						new JsonLiteral('jsonSchemaValidator()'),
					);
				}

				if (this.options.useHttps) {
					pluginsArray.addItem(new JsonLiteral('basicSsl()'));
				}
				break;

			case OutputType.ReactLibrary:
				pluginsArray.addItem(
					new JsonLiteral(
						`react(${new JsonObject()
							// https://miyauchi.dev/ja/posts/lib-vite-tailwindcss/
							.addEntry('jsxRuntime', 'classic')
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
				break;

			case OutputType.VueApplication:
			case OutputType.VueLibrary /* REVIEW */:
				pluginsArray.addItem(new JsonLiteral('vue()'));

				if (this.options.useHttps) {
					pluginsArray.addItem(new JsonLiteral('basicSsl()'));
				}
				break;
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

		const serverObj = new JsonObject();
		configObj.addEntry('server', serverObj);

		if (this.options.configureCustomProxyRules) {
			serverObj.addEntry(
				'proxy',
				new JsonObject().addEntry(
					'/api',
					new JsonObject()
						.addEntry('target', 'http://localhost:5000')
						.addEntry('changeOrigin', true)
						.addEntry(
							'rewrite',
							new JsonLiteral(
								"(path) => path.replace(/^\\/api/, '')",
							),
						)
						.addEntry(
							'headers',
							new JsonObject().addEntry('x-real-ip', 'localhost'),
						),
				),
			);
		}

		if (this.options.useHttps) {
			serverObj.addEntry('https', true);
		}

		if (this.options.publicBasePath !== undefined) {
			configObj.addEntry(
				'base',
				new JsonLiteral(
					`process.env.NODE_ENV === 'production' ? '/${this.options.publicBasePath}/' : './'`,
				),
			);
		}

		const lines: string[] = [];
		lines.push(`${imports.toFormattedString({ newLine })}`);

		if (this.options.useRouteSphere) {
			lines.push('');
			lines.push(`const schemas = resolve(__dirname, 'schemas');

// https://github.com/ajv-validator/ajv/issues/406#issuecomment-1015785863
const jsonSchemaValidator = (): PluginOption => {
	return {
		name: 'rollup-plugin-ajv-validator',
		resolveId: (source) =>
			source.indexOf('.jsonschema') === -1 ? null : source,
		load: async (id) => {
			if (id.indexOf('.jsonschema') === -1) return null;

			const schemaFile = id.replace(/\\.jsonschema$/, '.schema.json');

			try {
				const schemaPath = join(schemas, schemaFile);
				const schemaJson = await fs.promises.readFile(
					schemaPath,
					'utf8',
				);
				const schema = JSON.parse(schemaJson);

				const ajv = new Ajv({
					code: { source: true, esm: true },
					coerceTypes: true,
				});
				const validator = ajv.compile(schema);
				const sourceOut = ajvGenerate(ajv, validator);

				return sourceOut;
			} catch (ex) {
				console.error(ex);

				return 'export default () => true';
			}
		},
	};
};`);
		}

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

		switch (this.options.ui) {
			case UIFramework.ElasticUI:
				imports
					.addModuleNameImport('@/icons')
					.addNamedImport('@elastic/eui', (builder) => {
						builder.addNamedExport('EuiProvider');
					})
					.addDefaultImport('createCache', '@emotion/cache');
				break;

			case UIFramework.Bootstrap:
				imports.addModuleNameImport('@/App.scss');
				break;

			case UIFramework.Mantine:
				imports
					.addNamedImport('@mantine/core', (builder) => {
						builder.addNamedExport('MantineProvider');
					})
					.addModuleNameImport('@mantine/core/styles.css');
				break;
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

		switch (this.options.ui) {
			case UIFramework.ElasticUI:
				lines.push(
					`${tab}return <EuiProvider colorMode="dark" cache={euiCache}></EuiProvider>;`,
				);
				break;

			case UIFramework.Mantine:
				lines.push(`${tab}return <MantineProvider></MantineProvider>`);
				break;

			default:
				lines.push(`${tab}return <></>;`);
				break;
		}

		lines.push('};');
		lines.push('');
		lines.push('export default App;');
		return this.joinLines(lines);
	}

	generateSrcAppVue(): string {
		return `<script setup lang="ts"></script>

<template></template>

<style scoped></style>
`;
	}

	generateSrcMainTsxForReact(): string {
		switch (this.options.reactMajorVersion) {
			case 17:
			default:
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

	generateSrcMainTSForVue(): string {
		return `import { createApp } from 'vue';

import App from './App.vue';

createApp(App).mount('#root');
`;
	}

	generateSrcViteEnvDTS(): string {
		const lines: string[] = [];
		lines.push('/// <reference types="vite/client" />');
		return this.joinLines(lines);
	}

	generateSrcGlobalDTSForElasticUI(): string {
		return `// https://github.com/elastic/eui/issues/5463#issuecomment-1107665339
declare module '@elastic/eui/es/components/icon/*';
`;
	}

	generateSrcIconsTsForElasticUI(): string {
		return `// https://github.com/elastic/eui/issues/5463#issuecomment-1107665339
import { ICON_TYPES } from '@elastic/eui';
import { icon as alert } from '@elastic/eui/es/components/icon/assets/alert';
import { icon as apps } from '@elastic/eui/es/components/icon/assets/apps';
import { icon as arrowDown } from '@elastic/eui/es/components/icon/assets/arrow_down';
import { icon as arrowLeft } from '@elastic/eui/es/components/icon/assets/arrow_left';
import { icon as arrowRight } from '@elastic/eui/es/components/icon/assets/arrow_right';
import { icon as arrowEnd } from '@elastic/eui/es/components/icon/assets/arrowEnd';
import { icon as arrowStart } from '@elastic/eui/es/components/icon/assets/arrowStart';
import { icon as calendar } from '@elastic/eui/es/components/icon/assets/calendar';
import { icon as check } from '@elastic/eui/es/components/icon/assets/check';
import { icon as copyClipboard } from '@elastic/eui/es/components/icon/assets/copy_clipboard';
import { icon as cross } from '@elastic/eui/es/components/icon/assets/cross';
import { icon as dot } from '@elastic/eui/es/components/icon/assets/dot';
import { icon as editorBold } from '@elastic/eui/es/components/icon/assets/editor_bold';
import { icon as editorChecklist } from '@elastic/eui/es/components/icon/assets/editor_checklist';
import { icon as editorItalic } from '@elastic/eui/es/components/icon/assets/editor_italic';
import { icon as editorLink } from '@elastic/eui/es/components/icon/assets/editor_link';
import { icon as editorOrderedList } from '@elastic/eui/es/components/icon/assets/editor_ordered_list';
import { icon as editorUnorderedList } from '@elastic/eui/es/components/icon/assets/editor_unordered_list';
import { icon as empty } from '@elastic/eui/es/components/icon/assets/empty';
import { icon as eye } from '@elastic/eui/es/components/icon/assets/eye';
import { icon as eyeClosed } from '@elastic/eui/es/components/icon/assets/eye_closed';
import { icon as lock } from '@elastic/eui/es/components/icon/assets/lock';
import { icon as logoGithub } from '@elastic/eui/es/components/icon/assets/logo_github';
import { icon as menu } from '@elastic/eui/es/components/icon/assets/menu';
import { icon as popout } from '@elastic/eui/es/components/icon/assets/popout';
import { icon as questionInCircle } from '@elastic/eui/es/components/icon/assets/question_in_circle';
import { icon as quote } from '@elastic/eui/es/components/icon/assets/quote';
import { icon as returnKey } from '@elastic/eui/es/components/icon/assets/return_key';
import { icon as search } from '@elastic/eui/es/components/icon/assets/search';
import { icon as sortDown } from '@elastic/eui/es/components/icon/assets/sort_down';
import { icon as sortUp } from '@elastic/eui/es/components/icon/assets/sort_up';
import { icon as warning } from '@elastic/eui/es/components/icon/assets/warning';
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
	calendar,
	check,
	copyClipboard,
	cross,
	dot,
	editorBold,
	editorChecklist,
	editorItalic,
	editorLink,
	editorOrderedList,
	editorUnorderedList,
	empty,
	eye,
	eyeClosed,
	lock,
	logoGithub,
	menu,
	popout,
	questionInCircle,
	quote,
	returnKey,
	search,
	sortDown,
	sortUp,
	warning,
};

appendIconComponentCache(cachedIcons);
`;
	}

	generateSrcAppScssForBootstrap(): string {
		return `@import 'bootstrap/scss/bootstrap';
`;
	}

	generateSrcStoresPaginationStoreTs(): string {
		return `import { action, computed, makeObservable, observable } from 'mobx';

export class PaginationStore {
	@observable page = 1;
	@observable perPage = 10;
	@observable totalCount = 0;

	constructor() {
		makeObservable(this);
	}

	@computed get pageIndex(): number {
		return this.page - 1;
	}

	@computed get pageCount(): number {
		return Math.ceil(this.totalCount / this.perPage);
	}

	@action.bound setPage(value: number): void {
		this.page = value;
	}

	@action.bound setPageIndex(value: number): void {
		this.page = value + 1;
	}

	@action.bound goToFirstPage(): void {
		this.page = 1;
	}

	@action.bound setPerPage(value: number): void {
		this.perPage = value;
	}

	@action.bound setTotalCount(value: number): void {
		this.totalCount = value;
	}
}
`;
	}

	generateNginxNginxConf(): string {
		return `server {
    listen 8080;

    root /usr/share/nginx/html;

    index index.html index.htm index.nginx-debian.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
`;
	}

	generateDockerfile(): string {
		const lines: string[] = [];

		lines.push('FROM node:20-alpine as build');

		lines.push('');
		lines.push('WORKDIR /app');

		if (this.options.packageManager === PackageManager.Pnpm) {
			lines.push('');
			lines.push('RUN npm i -g pnpm');
		}

		switch (this.options.packageManager) {
			case PackageManager.Npm:
			default:
				lines.push('');
				lines.push('COPY package.json package-lock.json ./');
				lines.push('RUN npm ci');
				break;

			case PackageManager.Pnpm:
				lines.push('');
				lines.push('COPY package.json pnpm-lock.yaml ./');
				lines.push('RUN pnpm install --frozen-lockfile');
				break;
		}

		lines.push('');
		lines.push('COPY . .');

		switch (this.options.packageManager) {
			case PackageManager.Npm:
			default:
				lines.push('RUN npm run build');
				break;

			case PackageManager.Pnpm:
				lines.push('RUN pnpm build');
				break;
		}

		lines.push('');
		lines.push('FROM nginx:latest');
		lines.push('COPY --from=build /app/dist /usr/share/nginx/html');
		lines.push('COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf');

		lines.push('');
		lines.push('EXPOSE 8080');

		lines.push('');
		lines.push('CMD ["nginx", "-g", "daemon off;"]');

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

		switch (this.options.outputType) {
			case OutputType.ReactApplication:
			case OutputType.ReactLibrary:
			case undefined:
				yield {
					path: 'src/App.tsx',
					text: this.generateSrcAppTsx(),
				};
				yield {
					path: 'src/main.tsx',
					text: this.generateSrcMainTsxForReact(),
				};
				break;

			case OutputType.VueApplication:
			case OutputType.VueLibrary:
				yield {
					path: 'src/App.vue',
					text: this.generateSrcAppVue(),
				};
				yield {
					path: 'src/main.ts',
					text: this.generateSrcMainTSForVue(),
				};
				break;
		}

		yield {
			path: 'src/vite-env.d.ts',
			text: this.generateSrcViteEnvDTS(),
		};

		switch (this.options.ui) {
			case UIFramework.ElasticUI:
				yield {
					path: 'src/global.d.ts',
					text: this.generateSrcGlobalDTSForElasticUI(),
				};
				yield {
					path: 'src/icons.ts',
					text: this.generateSrcIconsTsForElasticUI(),
				};
				break;

			case UIFramework.Bootstrap:
				yield {
					path: 'src/App.scss',
					text: this.generateSrcAppScssForBootstrap(),
				};
				break;
		}

		if (this.options.generateStores) {
			yield {
				path: 'src/stores/PaginationStore.ts',
				text: this.generateSrcStoresPaginationStoreTs(),
			};
		}

		if (this.options.generateDockerfile) {
			yield {
				path: 'nginx/nginx.conf',
				text: this.generateNginxNginxConf(),
			};
			yield {
				path: 'Dockerfile',
				text: this.generateDockerfile(),
			};
			yield {
				path: '.dockerignore',
				text: new ReactGitignoreGenerator(
					this.editorConfig,
					{},
				).generate(),
			};
		}
	}
}
