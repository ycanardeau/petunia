import {
	IconLibrary,
	TestingFramework,
	UIFramework,
} from '@/core/projects/TypeScriptViteReactProject';
import { ProjectCreateStore } from '@/stores/ProjectCreateStore';
import {
	EuiButton,
	EuiCheckbox,
	EuiFieldText,
	EuiFlexGroup,
	EuiFlexItem,
	EuiForm,
	EuiFormFieldset,
	EuiFormRow,
	EuiIconTip,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
	EuiSelect,
	EuiSpacer,
	EuiSwitch,
} from '@elastic/eui';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

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
					label="Project name" /* LOC */
					isInvalid={
						projectCreateStore.validationError_invalidProjectName
					}
					error={['Empty or invalid project name' /* LOC */]}
					display="rowCompressed"
				>
					<EuiFieldText
						value={projectCreateStore.projectName}
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.projectName = e.target.value;
							});
						}}
						isInvalid={
							projectCreateStore.validationError_invalidProjectName
						}
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
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.test = e.target
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
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.ui = e.target
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
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.icon = e.target
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
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.enablePrettier =
									e.target.checked;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow display="rowCompressed">
					<EuiSwitch
						label="Sort imports" /* LOC */
						checked={projectCreateStore.sortImports}
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.sortImports =
									e.target.checked;
							});
						}}
						disabled={!projectCreateStore.enablePrettier}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow display="rowCompressed">
					<EuiSwitch
						label="Enable ESLint" /* LOC */
						checked={projectCreateStore.enableESLint}
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.enableESLint =
									e.target.checked;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow display="rowCompressed">
					<EuiSwitch
						label="Configure path aliases" /* LOC */
						checked={projectCreateStore.configurePathAliases}
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.configurePathAliases =
									e.target.checked;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiSpacer size="m" />

				<EuiFormFieldset
					legend={{ children: 'Additional packages' /* LOC */ }}
				>
					<EuiFlexGroup
						alignItems="center"
						gutterSize="s"
						responsive={false}
					>
						<EuiFlexItem grow={false}>
							<EuiCheckbox
								id="useAjv"
								label="Ajv"
								checked={projectCreateStore.useAjv}
								onChange={(e): void =>
									runInAction(() => {
										projectCreateStore.useAjv =
											e.target.checked;
									})
								}
							/>
						</EuiFlexItem>

						<EuiFlexItem grow={false}>
							<EuiIconTip
								content="The fastest JSON schema Validator."
								position="right"
							/>
						</EuiFlexItem>
					</EuiFlexGroup>

					<EuiFlexGroup
						alignItems="center"
						gutterSize="s"
						responsive={false}
					>
						<EuiFlexItem grow={false}>
							<EuiCheckbox
								id="useLodash"
								label="Lodash"
								checked={projectCreateStore.useLodash}
								onChange={(e): void =>
									runInAction(() => {
										projectCreateStore.useLodash =
											e.target.checked;
									})
								}
							/>
						</EuiFlexItem>

						<EuiFlexItem grow={false}>
							<EuiIconTip
								content="A modern JavaScript utility library delivering modularity, performance, & extras."
								position="right"
							/>
						</EuiFlexItem>
					</EuiFlexGroup>

					<EuiFlexGroup
						alignItems="center"
						gutterSize="s"
						responsive={false}
					>
						<EuiFlexItem grow={false}>
							<EuiCheckbox
								id="useMobX"
								label="MobX"
								checked={projectCreateStore.useMobX}
								onChange={(e): void =>
									runInAction(() => {
										projectCreateStore.useMobX =
											e.target.checked;
									})
								}
							/>
						</EuiFlexItem>

						<EuiFlexItem grow={false}>
							<EuiIconTip
								content="Simple, scalable state management."
								position="right"
							/>
						</EuiFlexItem>
					</EuiFlexGroup>

					<EuiFlexGroup
						alignItems="center"
						gutterSize="s"
						responsive={false}
					>
						<EuiFlexItem grow={false}>
							<EuiCheckbox
								id="useQs"
								label="qs"
								checked={projectCreateStore.useQs}
								onChange={(e): void =>
									runInAction(() => {
										projectCreateStore.useQs =
											e.target.checked;
									})
								}
							/>
						</EuiFlexItem>

						<EuiFlexItem grow={false}>
							<EuiIconTip
								content="A querystring parser with nesting support"
								position="right"
							/>
						</EuiFlexItem>
					</EuiFlexGroup>

					<EuiFlexGroup
						alignItems="center"
						gutterSize="s"
						responsive={false}
					>
						<EuiFlexItem grow={false}>
							<EuiCheckbox
								id="useReactRouter"
								label="React Router"
								checked={projectCreateStore.useReactRouter}
								onChange={(e): void =>
									runInAction(() => {
										projectCreateStore.useReactRouter =
											e.target.checked;
									})
								}
							/>
						</EuiFlexItem>

						<EuiFlexItem grow={false}>
							<EuiIconTip
								content="Declarative routing for React"
								position="right"
							/>
						</EuiFlexItem>
					</EuiFlexGroup>
				</EuiFormFieldset>
			</EuiForm>
		);
	},
);

export const ProjectCreateModal = observer((): React.ReactElement => {
	const [projectCreateStore] = React.useState(() => new ProjectCreateStore());

	return (
		<>
			<EuiModalHeader>
				<EuiModalHeaderTitle>
					Create a new project{/* LOC */}
				</EuiModalHeaderTitle>
			</EuiModalHeader>

			<EuiModalBody>
				<ProjectCreateForm projectCreateStore={projectCreateStore} />
			</EuiModalBody>

			<EuiModalFooter>
				<EuiButton
					fill
					size="s"
					onClick={projectCreateStore.submit}
					disabled={projectCreateStore.hasValidationErrors}
				>
					Create{/* LOC */}
				</EuiButton>
			</EuiModalFooter>
		</>
	);
});
