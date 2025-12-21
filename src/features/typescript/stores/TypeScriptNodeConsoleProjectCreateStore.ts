import { tryFormat } from '@/features/common/helpers/tryFormat';
import { OrmFramework } from '@/features/typescript/projects/OrmFramework';
import { PackageManager } from '@/features/typescript/projects/PackageManager';
import { TypeScriptNodeConsoleProject } from '@/features/typescript/projects/TypeScriptNodeConsoleProject';
import { TestingFramework } from '@/features/typescript/projects/TypeScriptProject';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { action, computed, makeObservable, observable } from 'mobx';
import validate from 'validate-npm-package-name';

export class TypeScriptNodeConsoleProjectCreateStore {
	@observable projectName = 'console-app';
	@observable packageManager = PackageManager.Pnpm;
	@observable test = TestingFramework.None;
	@observable orm = OrmFramework.None;
	@observable enablePrettier = true;
	@observable sortImports = true;
	@observable enableESLint = true;

	@observable private _installBoundaries = true;
	@computed get installBoundaries(): boolean {
		return this.enableESLint && this._installBoundaries;
	}
	set installBoundaries(value: boolean) {
		this._installBoundaries = value;
	}

	@observable configurePathAliases = true;
	@observable generateDockerfile = false;
	@observable useAjv = false;
	@observable useLodash = false;
	@observable useQs = false;
	@observable useYohira = false;

	constructor() {
		makeObservable(this);
	}

	@computed get validationError_invalidProjectName(): boolean {
		const { validForNewPackages } = validate(this.projectName);
		return !validForNewPackages;
	}

	@computed get hasValidationErrors(): boolean {
		return this.validationError_invalidProjectName;
	}

	@action.bound async submit(): Promise<void> {
		if (this.hasValidationErrors) {
			return;
		}

		const zip = new JSZip();

		const project = new TypeScriptNodeConsoleProject(
			{ tab: '\t', newLine: '\n' },
			{
				projectName: this.projectName,
				packageManager: this.packageManager,
				test: this.test,
				orm: this.orm,
				enablePrettier: this.enablePrettier,
				sortImports: this.sortImports
					? '@trivago/prettier-plugin-sort-imports'
					: undefined,
				enableESLint: this.enableESLint,
				installBoundaries: this.installBoundaries,
				configurePathAliases: this.configurePathAliases,
				generateDockerfile: this.generateDockerfile,
				useAjv: this.useAjv,
				useLodash: this.useLodash,
				useQs: this.useQs,
				useYohira: this.useYohira,
			},
		);
		const projectFiles = Array.from(project.generateProjectFiles()).map(
			(projectFile) => {
				return {
					path: `${this.projectName}/${projectFile.path}`,
					text: tryFormat(projectFile),
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
