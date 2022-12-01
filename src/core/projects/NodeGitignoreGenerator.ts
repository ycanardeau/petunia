import { SourceTextGenerator } from '@/core/projects/SourceTextGenerator';

export class NodeGitignoreGenerator extends SourceTextGenerator {
	generate = (): string => {
		const lines: string[] = [];
		lines.push('node_modules');
		lines.push('dist');
		return this.joinLines(lines);
	};
}
