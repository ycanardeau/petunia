import { JsonArray, JsonLiteral, JsonObject } from '@/core/JsonValue';
import { SourceTextGenerator } from '@/core/projects/SourceTextGenerator';

interface ESLintRcCjsOptions {
	sortImports?: boolean;
	extendsReactApp?: boolean;
}

export class ESLintRcCjsGenerator extends SourceTextGenerator<ESLintRcCjsOptions> {
	generate(): string {
		const { tab, newLine } = this.editorConfig;

		const extendsArray = new JsonArray()
			.addItem('plugin:@typescript-eslint/recommended')
			.addItem('plugin:prettier/recommended');

		if (this.options.extendsReactApp) {
			extendsArray.addItem('react-app');
		}

		const pluginsArray = new JsonArray().addItem(
			'@typescript-eslint/eslint-plugin',
		);

		if (this.options.sortImports) {
			pluginsArray.addItem('simple-import-sort').addItem('import');
		}

		const rulesArray = new JsonObject()
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
			.addEntry('@typescript-eslint/no-empty-function', 'off');

		if (this.options.sortImports) {
			rulesArray
				.addEntry('simple-import-sort/imports', 'error')
				.addEntry('simple-import-sort/exports', 'error')
				.addEntry('import/first', 'error')
				.addEntry('import/newline-after-import', 'error')
				.addEntry('import/no-duplicates', 'error');
		}

		const rootObj = new JsonObject()
			.addEntry('parser', '@typescript-eslint/parser')
			.addEntry(
				'parserOptions',
				new JsonObject()
					.addEntry('project', 'tsconfig.json')
					.addEntry('sourceType', 'module')
					.addEntry('tsconfigRootDir', new JsonLiteral('__dirname'))
					.addEntry('ecmaVersion', 'latest'),
			)
			.addEntry('plugins', pluginsArray)
			.addEntry('extends', extendsArray)
			.addEntry('root', true)
			.addEntry(
				'env',
				new JsonObject().addEntry('node', true).addEntry('jest', true),
			)
			.addEntry(
				'ignorePatterns',
				new JsonArray().addItem('.eslintrc.cjs'),
			)
			.addEntry('rules', rulesArray);

		return `module.exports = ${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'JavaScript',
		})};${newLine}`;
	}
}
