import { ESLintRcCjsGenerator } from '@/features/typescript/projects/ESLintRcCjsGenerator';
import { describe, expect, test } from 'vitest';

describe('ESLintRcCjsGenerator', () => {
	test('generate', () => {
		const generator = new ESLintRcCjsGenerator(undefined, {});
		const actual = generator.generate();
		const expected = `module.exports = {
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: [
		'dist',
	],
	overrides: [
		{
			files: [
				'**/*.{ts,tsx}',
			],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname,
			},
			plugins: [
				'@typescript-eslint/eslint-plugin',
			],
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:prettier/recommended',
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
		},
	],
};
`;
		expect(actual).toBe(expected);
	});

	test('generate sortImports @trivago/prettier-plugin-sort-imports', () => {
		const generator = new ESLintRcCjsGenerator(undefined, {
			sortImports: '@trivago/prettier-plugin-sort-imports',
		});
		const actual = generator.generate();
		const expected = `module.exports = {
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: [
		'dist',
	],
	overrides: [
		{
			files: [
				'**/*.{ts,tsx}',
			],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname,
			},
			plugins: [
				'@typescript-eslint/eslint-plugin',
			],
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:prettier/recommended',
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
		},
	],
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
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: [
		'dist',
	],
	overrides: [
		{
			files: [
				'**/*.{ts,tsx}',
			],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname,
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
		},
	],
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
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: [
		'dist',
	],
	overrides: [
		{
			files: [
				'**/*.{ts,tsx}',
			],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname,
			},
			plugins: [
				'@typescript-eslint/eslint-plugin',
			],
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:prettier/recommended',
				'react-app',
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
		},
	],
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
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: [
		'dist',
	],
	overrides: [
		{
			files: [
				'**/*.{ts,tsx}',
			],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname,
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
		},
	],
};
`;
		expect(actual).toBe(expected);
	});

	test('generate configurePathAliases', () => {
		const generator = new ESLintRcCjsGenerator(undefined, {
			configurePathAliases: true,
		});
		const actual = generator.generate();
		const expected = `module.exports = {
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: [
		'dist',
	],
	overrides: [
		{
			files: [
				'**/*.{ts,tsx}',
			],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname,
			},
			plugins: [
				'@typescript-eslint/eslint-plugin',
			],
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:prettier/recommended',
			],
			settings: {
				'import/resolver': {
					typescript: {
						alwaysTryTypes: true,
					},
				},
			},
			rules: {
				'@typescript-eslint/interface-name-prefix': 'off',
				'@typescript-eslint/explicit-function-return-type': 'error',
				'@typescript-eslint/explicit-module-boundary-types': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-empty-function': 'off',
				'@typescript-eslint/no-floating-promises': 'error',
				'no-restricted-imports': [
					'error',
					{
						patterns: [
							{
								group: [
									'./*',
									'../*',
								],
								message: 'Relative imports are not allowed. Use absolute imports.',
							},
						],
					},
				],
				'import/no-internal-modules': [
					'error',
					{
						forbid: [
							'**/index',
							'**/index.ts',
							'**/index.tsx',
							'**/index.js',
							'**/index.jsx',
						],
					},
				],
			},
		},
	],
};
`;
		expect(actual).toBe(expected);
	});
});
