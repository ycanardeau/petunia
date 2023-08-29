import { JsonArray, JsonObject } from '@/core/JsonValue';
import { SourceTextGenerator } from '@/core/projects/SourceTextGenerator';

interface PrettierRcJsonOptions {
	sortImports?: boolean;
}

export class PrettierRcJsonGenerator extends SourceTextGenerator<PrettierRcJsonOptions> {
	generate(): string {
		const { tab, newLine } = this.editorConfig;

		const rootObj = new JsonObject()
			.addEntry('singleQuote', true)
			.addEntry('trailingComma', 'all');

		if (this.options.sortImports) {
			rootObj
				.addEntry(
					'importOrder',
					new JsonArray()
						.addItem('^@core/(.*)$')
						.addItem('^@server/(.*)$')
						.addItem('^@ui/(.*)$')
						.addItem('^[./]'),
				)
				.addEntry('importOrderSeparation', true)
				.addEntry('importOrderSortSpecifiers', true)
				.addEntry(
					'importOrderParserPlugins',
					new JsonArray()
						.addItem('jsx')
						.addItem('typescript')
						.addItem('importOrderParserPlugins')
						.addItem('classProperties')
						.addItem('decorators-legacy')
						.addItem('importAssertions'),
				);
		}

		rootObj.addEntry(
			'plugins',
			new JsonArray().addItem('@trivago/prettier-plugin-sort-imports'),
		);

		return `${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	}
}
