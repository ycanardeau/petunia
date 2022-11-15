import { JsonArray, JsonLiteral, JsonObject } from '@/core/JsonValue';
import { EditorConfig, Project, ProjectFile } from '@/core/projects/Project';
import { generateEditorConfig } from '@/core/projects/generateEditorConfig';
import { generatePrettierRcJson } from '@/core/projects/generatePrettierRcJson';

export class TypeScriptViteReactProject extends Project {
	static generateGitignore = ({ newLine }: EditorConfig): string => {
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

	static generatePackageJson = ({ tab, newLine }: EditorConfig): string => {
		var dependencies = new JsonObject()
			.addEntry('react', '^18.2.0')
			.addEntry('react-dom', '^18.2.0');

		var devDependencies = new JsonObject()
			.addEntry('@types/react', '^18.0.24')
			.addEntry('@types/react-dom', '^18.0.8')
			.addEntry('@vitejs/plugin-react', '^2.2.0')
			.addEntry('typescript', '^4.6.4')
			.addEntry('vite', '^3.2.3');

		var obj = new JsonObject()
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
			.addEntry('dependencies', dependencies)
			.addEntry('devDependencies', devDependencies);

		return `${obj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	};

	static generateTSConfigJson = ({ tab, newLine }: EditorConfig): string => {
		var compilerOptions = new JsonObject()
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

		var obj = new JsonObject()
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

	static generateTSConfigNodeJson = ({
		tab,
		newLine,
	}: EditorConfig): string => {
		var compilerOptions = new JsonObject()
			.addEntry('composite', true)
			.addEntry('module', 'ESNext')
			.addEntry('moduleResolution', 'Node')
			.addEntry('allowSyntheticDefaultImports', true);

		var obj = new JsonObject()
			.addEntry('compilerOptions', compilerOptions)
			.addEntry('include', new JsonArray().addItem('vite.config.ts'));

		return `${obj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	};

	static generateESLintRcJS = ({ tab, newLine }: EditorConfig): string => {
		var obj = new JsonObject()
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

	static generateIndexHtml = ({ tab, newLine }: EditorConfig): string => {
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

	static generateViteConfigTS = ({ tab, newLine }: EditorConfig): string => {
		const result: string[] = [];
		result.push(`import react from '@vitejs/plugin-react';`);
		result.push(`import { defineConfig } from 'vite';`);
		result.push('');
		result.push('// https://vitejs.dev/config/');
		result.push('export default defineConfig({');
		result.push(`${tab}plugins: [react()],`);
		result.push('});');
		return `${result.join(newLine)}${newLine}`;
	};

	static generateSrcAppTsx = ({ tab, newLine }: EditorConfig): string => {
		const result: string[] = [];
		result.push(`import React from 'react';`);
		result.push('');
		result.push('const App = (): React.ReactElement => {');
		result.push(`${tab}return <></>;`);
		result.push('};');
		result.push('');
		result.push('export default App;');
		return `${result.join(newLine)}${newLine}`;
	};

	static generateSrcMainTsx = ({ tab, newLine }: EditorConfig): string => {
		const result: string[] = [];
		result.push(`import App from './App';`);
		result.push(`import React from 'react';`);
		result.push(`import ReactDOM from 'react-dom/client';`);
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

	static generateSrcViteEnvDTS = ({ newLine }: EditorConfig): string => {
		const result: string[] = [];
		result.push('/// <reference types="vite/client" />');
		return `${result.join(newLine)}${newLine}`;
	};

	*generateProjectFiles(): Generator<ProjectFile> {
		const { editorConfig } = this.options;
		yield {
			path: '.editorconfig',
			text: generateEditorConfig(editorConfig),
		};
		yield {
			path: '.prettierrc.json',
			text: generatePrettierRcJson(editorConfig),
		};

		yield {
			path: '.gitignore',
			text: TypeScriptViteReactProject.generateGitignore(editorConfig),
		};
		yield {
			path: 'package.json',
			text: TypeScriptViteReactProject.generatePackageJson(editorConfig),
		};
		yield {
			path: 'tsconfig.json',
			text: TypeScriptViteReactProject.generateTSConfigJson(editorConfig),
		};
		yield {
			path: 'tsconfig.node.json',
			text: TypeScriptViteReactProject.generateTSConfigNodeJson(
				editorConfig,
			),
		};
		yield {
			path: '.eslintrc.js',
			text: TypeScriptViteReactProject.generateESLintRcJS(editorConfig),
		};
		yield {
			path: 'index.html',
			text: TypeScriptViteReactProject.generateIndexHtml(editorConfig),
		};
		yield {
			path: 'vite.config.ts',
			text: TypeScriptViteReactProject.generateViteConfigTS(editorConfig),
		};
		yield {
			path: 'src/main.tsx',
			text: TypeScriptViteReactProject.generateSrcMainTsx(editorConfig),
		};
		yield {
			path: 'src/vite-env.d.ts',
			text: TypeScriptViteReactProject.generateSrcViteEnvDTS(
				editorConfig,
			),
		};
	}
}
