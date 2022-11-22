import { JsonArray, JsonLiteral, JsonObject } from '@/core/JsonValue';
import { SourceTextGenerator } from '@/core/projects/SourceTextGenerator';

interface ESLintRcCjsGeneratorOptions {
	extendsReactApp?: boolean;
}

export class ESLintRcCjsGenerator extends SourceTextGenerator<ESLintRcCjsGeneratorOptions> {
	generate = (): string => {
		const { tab, newLine } = this.editorConfig;

		const _extends = new JsonArray()
			.addItem('plugin:@typescript-eslint/recommended')
			.addItem('plugin:prettier/recommended');

		if (this.options.extendsReactApp) {
			_extends.addItem('react-app');
		}

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
			.addEntry('extends', _extends)
			.addEntry('root', true)
			.addEntry(
				'env',
				new JsonObject().addEntry('node', true).addEntry('jest', true),
			)
			.addEntry(
				'ignorePatterns',
				new JsonArray().addItem('.eslintrc.cjs'),
			)
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
}
