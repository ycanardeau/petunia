import { tryFormat } from '@/features/common/helpers/tryFormat';
import { OrmFramework } from '@/features/typescript/projects/OrmFramework';
import { TypeScriptNestProject } from '@/features/typescript/projects/TypeScriptNestProject';
import { TestingFramework } from '@/features/typescript/projects/TypeScriptProject';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { action, computed, makeObservable, observable } from 'mobx';
import validate from 'validate-npm-package-name';

export class TypeScriptNestProjectCreateStore {
	@observable projectName = 'nest-app';
	@observable test = TestingFramework.None;
	@observable orm = OrmFramework.None;
	@observable enablePrettier = true;
	@observable sortImports = true;
	@observable enableESLint = true;
	@observable configurePathAliases = true;
	@observable useAjv = false;
	@observable useLodash = false;
	@observable useQs = false;

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

		const project = new TypeScriptNestProject(
			{ tab: '\t', newLine: '\n' },
			{
				projectName: this.projectName,
				test: this.test,
				orm: this.orm,
				enablePrettier: this.enablePrettier,
				sortImports: this.sortImports
					? '@trivago/prettier-plugin-sort-imports'
					: undefined,
				enableESLint: this.enableESLint,
				configurePathAliases: this.configurePathAliases,
				useAjv: this.useAjv,
				useLodash: this.useLodash,
				useQs: this.useQs,
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
