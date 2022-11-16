import {
	BuildTool,
	IconLibrary,
	ProjectCreateStore,
	ProjectType,
	TestingFramework,
	UIFramework,
} from '@/stores/ProjectCreateStore';
import {
	EuiButton,
	EuiFieldText,
	EuiForm,
	EuiFormRow,
	EuiModal,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
	EuiSelect,
	EuiSwitch,
} from '@elastic/eui';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

const projectTypeNames: Record<ProjectType, string> = {
	[ProjectType.React]: 'React',
};

const buildToolNames: Record<BuildTool, string> = {
	[BuildTool.Vite]: 'Vite',
};

const testingFrameworkNames: Record<TestingFramework, string> = {
	[TestingFramework.None]: 'None',
	[TestingFramework.Vitest]: 'Vitest',
};

const uiFrameworkNames: Record<UIFramework, string> = {
	[UIFramework.None]: 'None',
	[UIFramework.ElasticUI]: 'Elastic UI',
};

const iconLibraryNames: Record<IconLibrary, string> = {
	[IconLibrary.None]: 'None',
	[IconLibrary.FluentSystemIcons]: 'Fluent System Icons',
};

interface ProjectCreateFormProps {
	projectCreateStore: ProjectCreateStore;
}

const ProjectCreateForm = observer(
	({ projectCreateStore }: ProjectCreateFormProps): React.ReactElement => {
		return (
			<EuiForm>
				<EuiFormRow
					label="Project type" /* LOC */
					display="rowCompressed"
				>
					<EuiSelect
						options={Object.values(ProjectType).map(
							(projectType) => ({
								value: projectType,
								text: projectTypeNames[projectType],
							}),
						)}
						value={projectCreateStore.projectType}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.projectType = event.target
									.value as ProjectType;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow
					label="Project name" /* LOC */
					display="rowCompressed"
				>
					<EuiFieldText
						value={projectCreateStore.projectName}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.projectName =
									event.target.value;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow
					label="Build tool" /* LOC */
					display="rowCompressed"
				>
					<EuiSelect
						options={Object.values(BuildTool).map((buildTool) => ({
							value: buildTool,
							text: buildToolNames[buildTool],
						}))}
						value={projectCreateStore.buildTool}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.buildTool = event.target
									.value as BuildTool;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow
					label="Testing framework" /* LOC */
					display="rowCompressed"
				>
					<EuiSelect
						options={Object.values(TestingFramework).map(
							(testingFramework) => ({
								value: testingFramework,
								text: testingFrameworkNames[testingFramework],
							}),
						)}
						value={projectCreateStore.test}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.test = event.target
									.value as TestingFramework;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow
					label="UI framework" /* LOC */
					display="rowCompressed"
				>
					<EuiSelect
						options={Object.values(UIFramework).map(
							(uiFramework) => ({
								value: uiFramework,
								text: uiFrameworkNames[uiFramework],
							}),
						)}
						value={projectCreateStore.ui}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.ui = event.target
									.value as UIFramework;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow
					label="Icon library" /* LOC */
					display="rowCompressed"
				>
					<EuiSelect
						options={Object.values(IconLibrary).map(
							(iconLibrary) => ({
								value: iconLibrary,
								text: iconLibraryNames[iconLibrary],
							}),
						)}
						value={projectCreateStore.icon}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.icon = event.target
									.value as IconLibrary;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow display="rowCompressed">
					<EuiSwitch
						label="Enable Prettier" /* LOC */
						checked={projectCreateStore.enablePrettier}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.enablePrettier =
									event.target.checked;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow display="rowCompressed">
					<EuiSwitch
						label="Sort imports" /* LOC */
						checked={projectCreateStore.sortImports}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.sortImports =
									event.target.checked;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow display="rowCompressed">
					<EuiSwitch
						label="Enable ESLint" /* LOC */
						checked={projectCreateStore.enableESLint}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.enableESLint =
									event.target.checked;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow display="rowCompressed">
					<EuiSwitch
						label="Configure path aliases" /* LOC */
						checked={projectCreateStore.configurePathAliases}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.configurePathAliases =
									event.target.checked;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow label="Ajv" display="rowCompressed">
					<EuiSwitch
						label="Use Ajv for this project." /* LOC */
						checked={projectCreateStore.useAjv}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.useAjv =
									event.target.checked;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow label="Lodash" display="rowCompressed">
					<EuiSwitch
						label="Use Lodash for this project." /* LOC */
						checked={projectCreateStore.useLodash}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.useLodash =
									event.target.checked;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow label="MobX" display="rowCompressed">
					<EuiSwitch
						label="Use MobX for this project." /* LOC */
						checked={projectCreateStore.useMobX}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.useMobX =
									event.target.checked;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow label="React Router" display="rowCompressed">
					<EuiSwitch
						label="Use React Router for this project." /* LOC */
						checked={projectCreateStore.useReactRouter}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.useReactRouter =
									event.target.checked;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow label="qs" display="rowCompressed">
					<EuiSwitch
						label="Use qs for this project." /* LOC */
						checked={projectCreateStore.useQs}
						onChange={(event): void => {
							runInAction(() => {
								projectCreateStore.useQs = event.target.checked;
							});
						}}
						compressed
					/>
				</EuiFormRow>
			</EuiForm>
		);
	},
);

export const ProjectCreateModal = observer((): React.ReactElement => {
	const [projectCreateStore] = React.useState(() => new ProjectCreateStore());

	return (
		<EuiModal onClose={(): void => {}}>
			<EuiModalHeader>
				<EuiModalHeaderTitle>
					Create a new project{/* LOC */}
				</EuiModalHeaderTitle>
			</EuiModalHeader>

			<EuiModalBody>
				<ProjectCreateForm projectCreateStore={projectCreateStore} />
			</EuiModalBody>

			<EuiModalFooter>
				<EuiButton fill size="s" onClick={projectCreateStore.submit}>
					Create{/* LOC */}
				</EuiButton>
			</EuiModalFooter>
		</EuiModal>
	);
});
