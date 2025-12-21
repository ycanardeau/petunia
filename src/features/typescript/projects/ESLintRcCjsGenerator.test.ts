import { ESLintRcCjsGenerator } from '@/features/typescript/projects/ESLintRcCjsGenerator';
import { describe, expect, test } from 'vitest';

describe('ESLintRcCjsGenerator', () => {
	test('generate', () => {
		const generator = new ESLintRcCjsGenerator(undefined, {});
		const actual = generator.generate();
		const expected = `module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		ecmaVersion: 'latest',
	},
	plugins: [
		'@typescript-eslint/eslint-plugin',
	],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: [
		'.eslintrc.cjs',
	],
	settings: {},
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-floating-promises': 'error',
	},
};
`;
		expect(actual).toBe(expected);
	});

	test('generate sortImports eslint-plugin-simple-import-sort', () => {
		const generator = new ESLintRcCjsGenerator(undefined, {
			sortImports: 'eslint-plugin-simple-import-sort',
		});
		const actual = generator.generate();
		const expected = `module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		ecmaVersion: 'latest',
	},
	plugins: [
		'@typescript-eslint/eslint-plugin',
		'simple-import-sort',
		'import',
	],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: [
		'.eslintrc.cjs',
	],
	settings: {},
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-floating-promises': 'error',
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
		'import/first': 'error',
		'import/newline-after-import': 'error',
		'import/no-duplicates': 'error',
	},
};
`;
		expect(actual).toBe(expected);
	});

	test('generate extendsReactApp', () => {
		const generator = new ESLintRcCjsGenerator(undefined, {
			extendsReactApp: true,
		});
		const actual = generator.generate();
		const expected = `module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		ecmaVersion: 'latest',
	},
	plugins: [
		'@typescript-eslint/eslint-plugin',
	],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'react-app',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: [
		'.eslintrc.cjs',
	],
	settings: {},
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-floating-promises': 'error',
	},
};
`;
		expect(actual).toBe(expected);
	});

	test('generate installBoundaries', () => {
		const generator = new ESLintRcCjsGenerator(undefined, {
			installBoundaries: true,
		});
		const actual = generator.generate();
		const expected = `module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		ecmaVersion: 'latest',
	},
	plugins: [
		'@typescript-eslint/eslint-plugin',
		'boundaries',
	],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'plugin:boundaries/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: [
		'.eslintrc.cjs',
	],
	settings: {
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
			},
		},
		'boundaries/elements': [],
	},
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-floating-promises': 'error',
		'boundaries/element-types': [
			2,
			{
				default: 'disallow',
				rules: [],
			},
		],
	},
};
`;
		expect(actual).toBe(expected);
	});
});
