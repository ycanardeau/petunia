import { Project, ProjectFile } from '@/features/common/projects/Project';
import { PackageManager } from '@/features/csharp/projects/PackageManager';

interface CSharpCleanArchitectureProjectOptions {
	packageName: string;
	packageManager: PackageManager;
}

export class CSharpCleanArchitectureProject extends Project<CSharpCleanArchitectureProjectOptions> {
	generateProjectFiles(): Generator<ProjectFile> {
		throw new Error('Method not implemented.');
	}
}
