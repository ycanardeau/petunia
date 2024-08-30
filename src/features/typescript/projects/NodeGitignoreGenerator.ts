import { SourceTextGenerator } from '@/features/common/projects/SourceTextGenerator';
import { OrmFramework } from '@/features/typescript/projects/OrmFramework';

export class NodeGitignoreGenerator extends SourceTextGenerator<{
	orm?: OrmFramework;
}> {
	generate(): string {
		const lines: string[] = [];
		lines.push('node_modules');
		lines.push('dist');

		lines.push('');
		lines.push('.DS_Store');
		lines.push('.env');
		lines.push('.env.local');
		lines.push('.env.development.local');
		lines.push('.env.test.local');
		lines.push('.env.production.local');

		if (this.options.orm === OrmFramework.MikroOrm) {
			lines.push('/temp');
		}

		return this.joinLines(lines);
	}
}
