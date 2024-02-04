import { NodeGitignoreGenerator } from '@/core/projects/NodeGitignoreGenerator';
import { describe, expect, test } from 'vitest';

describe('NodeGitignoreGenerator', () => {
	test('generate', () => {
		const actual = new NodeGitignoreGenerator(undefined, {}).generate();
		expect(actual).toBe(`node_modules
dist

.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
`);
	});
});
