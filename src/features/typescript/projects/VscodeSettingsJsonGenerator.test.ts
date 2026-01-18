import { VscodeSettingsJsonGenerator } from '@/features/typescript/projects/VscodeSettingsJsonGenerator';
import { describe, expect, test } from 'vitest';

describe('VscodeSettingsJsonGenerator', () => {
	test('generate', () => {
		const generator = new VscodeSettingsJsonGenerator(undefined, {});
		const actual = generator.generate();
		const expected = `{}
`;
		expect(actual).toBe(expected);
	});

	test('generate enablePrettier', () => {
		const generator = new VscodeSettingsJsonGenerator(undefined, {
			enablePrettier: true,
		});
		const actual = generator.generate();
		const expected = `{
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	"editor.formatOnSave": true
}
`;
		expect(actual).toBe(expected);
	});

	test('generate configurePathAliases', () => {
		const generator = new VscodeSettingsJsonGenerator(undefined, {
			configurePathAliases: true,
		});
		const actual = generator.generate();
		const expected = `{
	"javascript.preferences.importModuleSpecifier": "non-relative",
	"typescript.preferences.importModuleSpecifier": "non-relative",
	"typescript.preferences.autoImportFileExcludePatterns": [
		"**/index.ts"
	]
}
`;
		expect(actual).toBe(expected);
	});
});
