import { JsonArray, JsonObject } from '@/core/JsonValue';
import { EditorConfig } from '@/core/projects/Project';

export const generatePrettierRcJson = ({
	tab,
	newLine,
}: EditorConfig): string => {
	const obj = new JsonObject()
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
		tab: tab,
		newLine: newLine,
		style: 'Json',
	})}${newLine}`;
};
