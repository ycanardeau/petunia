import { testingFrameworkNames } from '@/features/typescript/components/constants';
import {
	OrmFramework,
	ormFrameworkNames,
} from '@/features/typescript/projects/OrmFramework';
import {
	PackageManager,
	packageManagerNames,
} from '@/features/typescript/projects/PackageManager';
import { TestingFramework } from '@/features/typescript/projects/TypeScriptProject';
import { TypeScriptNodeConsoleProjectCreateStore } from '@/features/typescript/stores/TypeScriptNodeConsoleProjectCreateStore';
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

interface TypeScriptNodeConsoleProjectCreateFormProps {
	projectCreateStore: TypeScriptNodeConsoleProjectCreateStore;
}

const TypeScriptNodeConsoleProjectCreateForm = observer(
	({
		projectCreateStore,
	}: TypeScriptNodeConsoleProjectCreateFormProps): React.ReactElement => {
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
					label="Package manager" /* LOC */
					display="rowCompressed"
				>
					<EuiSelect
						options={Object.values(PackageManager).map((value) => ({
							value: value,
							text: packageManagerNames[value],
						}))}
						value={projectCreateStore.packageManager}
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.packageManager = e.target
									.value as PackageManager;
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
						options={[
							TestingFramework.None,
							TestingFramework.Vitest,
						].map((value) => ({
							value: value,
							text: testingFrameworkNames[value],
						}))}
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
					label="ORM Framework" /* LOC */
					display="rowCompressed"
				>
					<EuiSelect
						options={Object.values(OrmFramework).map((value) => ({
							value: value,
							text: ormFrameworkNames[value],
						}))}
						value={projectCreateStore.orm}
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.orm = e.target
									.value as OrmFramework;
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
						label="Install eslint-plugin-boundaries" /* LOC */
						checked={projectCreateStore.installBoundaries}
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.installBoundaries =
									e.target.checked;
							});
						}}
						disabled={!projectCreateStore.enableESLint}
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

				<EuiFormRow display="rowCompressed">
					<EuiSwitch
						label="Generate Dockerfile" /* LOC */
						checked={projectCreateStore.generateDockerfile}
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.generateDockerfile =
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
				</EuiFormFieldset>
			</EuiForm>
		);
	},
);

const TypeScriptNodeConsoleProjectCreateModal = observer(
	(): React.ReactElement => {
		const [projectCreateStore] = React.useState(
			() => new TypeScriptNodeConsoleProjectCreateStore(),
		);

		return (
			<>
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						Create a new project{/* LOC */}
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody>
					<TypeScriptNodeConsoleProjectCreateForm
						projectCreateStore={projectCreateStore}
					/>
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
	},
);

export default TypeScriptNodeConsoleProjectCreateModal;
