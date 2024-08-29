import { JsonObject } from '@/core/JsonValue';
import { SourceTextGenerator } from '@/features/typescript/projects/SourceTextGenerator';

interface PrettierRcJsonOptions {
	sortImports?: boolean;
}

export class PrettierRcJsonGenerator extends SourceTextGenerator<PrettierRcJsonOptions> {
	generate(): string {
		const { tab, newLine } = this.editorConfig;

		const rootObj = new JsonObject()
			.addEntry('singleQuote', true)
			.addEntry('trailingComma', 'all');

		return `${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	}
}
