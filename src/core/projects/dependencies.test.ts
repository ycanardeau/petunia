import dependencies from '@/core/projects/dependencies.json';
import validate from 'validate-npm-package-name';
import { expect, test } from 'vitest';

test('dependencies.json', () => {
	const regexp = new RegExp('^[\\^]?[\\d\\.]+$');
	for (const [key, value] of Object.entries(dependencies)) {
		const { validForNewPackages, validForOldPackages } = validate(key);
		expect(validForNewPackages || validForOldPackages).toBe(true);
		expect(regexp.test(value)).toBe(true);
	}
});
