import { SourceTextGenerator } from '@/features/common/projects/SourceTextGenerator';

export class ReactGitignoreGenerator extends SourceTextGenerator {
	generate(): string {
		const lines: string[] = [];
		lines.push('# Logs');
		lines.push('logs');
		lines.push('*.log');
		lines.push('npm-debug.log*');
		lines.push('yarn-debug.log*');
		lines.push('yarn-error.log*');
		lines.push('pnpm-debug.log*');
		lines.push('lerna-debug.log*');
		lines.push('');
		lines.push('node_modules');
		lines.push('dist');
		lines.push('dist-ssr');
		lines.push('*.local');
		lines.push('');
		lines.push('# Editor directories and files');
		lines.push('.vscode/*');
		lines.push('!.vscode/extensions.json');
		lines.push('.idea');
		lines.push('.DS_Store');
		lines.push('*.suo');
		lines.push('*.ntvs*');
		lines.push('*.njsproj');
		lines.push('*.sln');
		lines.push('*.sw?');
		return this.joinLines(lines);
	}
}
