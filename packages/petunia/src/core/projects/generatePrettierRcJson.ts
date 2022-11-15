import { JsonArray, JsonObject } from '@/core/JsonValue';
import { EditorConfig } from '@/core/projects/Project';

export const generatePrettierRcJson = (editorConfig: EditorConfig): string => {
	var obj = new JsonObject()
		.addEntry('singleQuote', true)
		.addEntry('trailingComma', 'all')
		.addEntry(
			'importOrder',
			new JsonArray()
				.addItem('^@core/(.*)$')
				.addItem('^@server/(.*)$')
				.addItem('^@ui/(.*)$')
				.addItem('^[./]'),
		)
		.addEntry('importOrderSeparation', true)
		.addEntry('importOrderSortSpecifiers', true);

	return `${obj.toFormattedString({
		tab: editorConfig.tab,
		newLine: editorConfig.newLine,
		style: 'Json',
	})}${editorConfig.newLine}`;
};
