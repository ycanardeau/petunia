import { ProjectFile } from '@/core/projects/Project';
import {
	TypeScriptProject,
	TypeScriptProjectOptions,
} from '@/core/projects/TypeScriptProject';

type TypeScriptNodeConsoleProjectOptions = TypeScriptProjectOptions;

export class TypeScriptNodeConsoleProject extends TypeScriptProject<TypeScriptNodeConsoleProjectOptions> {
	get isReactProject(): boolean {
		return false;
	}

	*generateProjectFiles(): Generator<ProjectFile> {
		yield* super.generateProjectFiles();
	}
}
