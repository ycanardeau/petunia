import { CSharpCleanArchitectureProject } from '@/features/csharp/projects/CSharpCleanArchitectureProject';
import { PackageManager } from '@/features/csharp/projects/PackageManager';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { action, computed, makeObservable, observable } from 'mobx';

export class CSharpCleanArchitectureProjectCreateStore {
	@observable projectName = 'CSharp.CleanArchitecture';
	@observable packageManager = PackageManager.NuGet;

	constructor() {
		makeObservable(this);
	}

	@computed get validationError_invalidProjectName(): boolean {
		return false; /* TODO: implement */
	}

	@computed get hasValidationErrors(): boolean {
		return this.validationError_invalidProjectName;
	}

	@action.bound async submit(): Promise<void> {
		if (this.hasValidationErrors) {
			return;
		}

		const zip = new JSZip();

		const project = new CSharpCleanArchitectureProject(
			{ tab: '\t', newLine: '\n' },
			{
				projectName: this.projectName,
				packageManager: this.packageManager,
			},
		);
		const projectFiles = Array.from(project.generateProjectFiles()).map(
			(projectFile) => {
				return {
					path: `${this.projectName}/${projectFile.path}`,
					text: projectFile.text,
				};
			},
		);
		for (const { path, text } of projectFiles) {
			zip.file(path, text);
		}

		const content = await zip.generateAsync({
			type: 'blob',
		});
		FileSaver.saveAs(content, `${this.projectName}.zip`);
	}
}
