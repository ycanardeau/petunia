import { Project, ProjectFile } from '@/features/common/projects/Project';
import { DotnetGitignoreGenerator } from '@/features/fsharp/projects/DotnetGitignoreGenerator';
import { PackageManager } from '@/features/fsharp/projects/PackageManager';

interface FSharpFableProjectOptions {
	projectName: string;
	packageManager: PackageManager;
}

export class FSharpFableProject extends Project<FSharpFableProjectOptions> {
	*generateProjectFiles(): Generator<ProjectFile> {
		yield {
			path: '.gitignore',
			text: new DotnetGitignoreGenerator(
				this.editorConfig,
				{},
			).generate(),
		};
	}
}
