import { JsonArray, JsonObject } from '@/core/JsonValue';
import { SourceTextGenerator } from '@/features/common/projects/SourceTextGenerator';

interface VscodeSettingsJsonOptions {
	enablePrettier?: boolean;
	configurePathAliases?: boolean;
}

export class VscodeSettingsJsonGenerator extends SourceTextGenerator<VscodeSettingsJsonOptions> {
	generate(): string {
		const { tab, newLine } = this.editorConfig;

		const rootObj = new JsonObject();

		if (this.options.enablePrettier) {
			rootObj
				.addEntry('editor.defaultFormatter', 'esbenp.prettier-vscode')
				.addEntry('editor.formatOnSave', true);
		}

		if (this.options.configurePathAliases) {
			rootObj
				.addEntry(
					'javascript.preferences.importModuleSpecifier',
					'non-relative',
				)
				.addEntry(
					'typescript.preferences.importModuleSpecifier',
					'non-relative',
				)
				.addEntry(
					'typescript.preferences.autoImportFileExcludePatterns',
					new JsonArray().addItem('**/index.ts'),
				);
		}

		return `${rootObj.toFormattedString({
			tab: tab,
			newLine: newLine,
			style: 'Json',
		})}${newLine}`;
	}
}
