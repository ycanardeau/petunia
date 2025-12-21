import { JsonArray, JsonLiteral, JsonObject } from '@/core/JsonValue';
import { SourceTextGenerator } from '@/features/common/projects/SourceTextGenerator';

interface ESLintRcCjsOptions {
	sortImports?: 'eslint-plugin-simple-import-sort';
	extendsReactApp?: boolean;
	installBoundaries?: boolean;
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

		if (this.options.installBoundaries) {
			extendsArray.addItem('plugin:boundaries/recommended');
		}

		const pluginsArray = new JsonArray().addItem(
			'@typescript-eslint/eslint-plugin',
		);

		if (this.options.sortImports === 'eslint-plugin-simple-import-sort') {
			pluginsArray.addItem('simple-import-sort').addItem('import');
		}

		if (this.options.installBoundaries) {
			pluginsArray.addItem('boundaries');
		}

		const settingsObj = new JsonObject();

		if (this.options.installBoundaries) {
			settingsObj
				.addEntry(
					'import/resolver',
					new JsonObject().addEntry(
						'typescript',
						new JsonObject().addEntry('alwaysTryTypes', true),
					),
				)
				.addEntry('boundaries/elements', new JsonArray());
		}

		const rulesObj = new JsonObject()
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
			.addEntry('@typescript-eslint/no-empty-function', 'off')
			.addEntry('@typescript-eslint/no-floating-promises', 'error');

		if (this.options.sortImports === 'eslint-plugin-simple-import-sort') {
			rulesObj
				.addEntry('simple-import-sort/imports', 'error')
				.addEntry('simple-import-sort/exports', 'error')
				.addEntry('import/first', 'error')
				.addEntry('import/newline-after-import', 'error')
				.addEntry('import/no-duplicates', 'error');
		}

		if (this.options.installBoundaries) {
			rulesObj.addEntry(
				'boundaries/element-types',
				new JsonArray([
					new JsonLiteral('2'),
					new JsonObject()
						.addEntry('default', 'disallow')
						.addEntry('rules', new JsonArray()),
				]),
			);
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
			.addEntry('settings', settingsObj)
			.addEntry('rules', rulesObj);

		return `module.exports = ${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'JavaScript',
		})};${newLine}`;
	}
}
