import { JsonArray, JsonObject } from '@/core/JsonValue';
import { EditorConfig, Project, ProjectFile } from '@/core/projects/Project';
import { generateEditorConfig } from '@/core/projects/generateEditorConfig';
import { generatePrettierRcJson } from '@/core/projects/generatePrettierRcJson';

export class TypeScriptViteReactProject extends Project {
	static generateGitignore = (editorConfig: EditorConfig): string => {
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
		return `${result.join(editorConfig.newLine)}${editorConfig.newLine}`;
	};

	static generatePackageJson = (editorConfig: EditorConfig): string => {
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
			tab: editorConfig.tab,
			newLine: editorConfig.newLine,
			style: 'Json',
		})}${editorConfig.newLine}`;
	};

	static generateTSConfigJson = (editorConfig: EditorConfig): string => {
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
			tab: editorConfig.tab,
			newLine: editorConfig.newLine,
			style: 'Json',
		})}${editorConfig.newLine}`;
	};

	static generateTSConfigNodeJson = (editorConfig: EditorConfig): string => {
		var compilerOptions = new JsonObject()
			.addEntry('composite', true)
			.addEntry('module', 'ESNext')
			.addEntry('moduleResolution', 'Node')
			.addEntry('allowSyntheticDefaultImports', true);

		var obj = new JsonObject()
			.addEntry('compilerOptions', compilerOptions)
			.addEntry('include', new JsonArray().addItem('vite.config.ts'));

		return `${obj.toFormattedString({
			tab: editorConfig.tab,
			newLine: editorConfig.newLine,
			style: 'Json',
		})}${editorConfig.newLine}`;
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
	}
}
