import { NodeGitignoreGenerator } from '@/core/projects/NodeGitignoreGenerator';
import { describe, expect, test } from 'vitest';

describe('NodeGitignoreGenerator', () => {
	test('generate', () => {
		const actual = new NodeGitignoreGenerator().generate();
		expect(actual).toBe(`node_modules
`);
	});
});
