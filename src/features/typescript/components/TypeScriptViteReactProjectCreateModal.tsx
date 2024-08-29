import { testingFrameworkNames } from '@/features/typescript/components/constants';
import {
	PackageManager,
	packageManagerNames,
} from '@/features/typescript/projects/PackageManager';
import { TestingFramework } from '@/features/typescript/projects/TypeScriptProject';
import {
	IconLibrary,
	OutputType,
	UIFramework,
} from '@/features/typescript/projects/TypeScriptViteReactProject';
import { TypeScriptViteReactProjectCreateStore } from '@/features/typescript/stores/TypeScriptViteReactProjectCreateStore';
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

const outputTypeNames: Record<OutputType, string> = {
	[OutputType.ReactApplication]: 'React Application' /* LOC */,
	[OutputType.ReactLibrary]: 'React Library' /* LOC */,
	[OutputType.VueApplication]: 'Vue Application' /* LOC */,
};

// TODO: move
export const uiFrameworkNames: Record<UIFramework, string> = {
	[UIFramework.None]: 'None',
	[UIFramework.ElasticUI]: 'Elastic UI',
	[UIFramework.Bootstrap]: 'Bootstrap',
	[UIFramework.Mantine]: 'Mantine',
};

// TODO: move
export const iconLibraryNames: Record<IconLibrary, string> = {
	[IconLibrary.None]: 'None',
	[IconLibrary.FluentSystemIcons]: 'Fluent System Icons',
};

interface TypeScriptViteReactProjectCreateFormProps {
	projectCreateStore: TypeScriptViteReactProjectCreateStore;
}

const TypeScriptViteReactProjectCreateForm = observer(
	({
		projectCreateStore,
	}: TypeScriptViteReactProjectCreateFormProps): React.ReactElement => {
		return (
			<EuiForm>
				<EuiFormRow
					label="Output type" /* LOC */
					display="rowCompressed"
				>
					<EuiSelect
						options={Object.values(OutputType).map((value) => ({
							value: value,
							text: outputTypeNames[value],
						}))}
						value={projectCreateStore.outputType}
						onChange={(e): void =>
							runInAction(() => {
								projectCreateStore.outputType = e.target
									.value as OutputType;
							})
						}
						compressed
					/>
				</EuiFormRow>

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
					label="UI framework" /* LOC */
					display="rowCompressed"
				>
					<EuiSelect
						options={Object.values(UIFramework).map((value) => ({
							value: value,
							text: uiFrameworkNames[value],
						}))}
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
						options={Object.values(IconLibrary).map((value) => ({
							value: value,
							text: iconLibraryNames[value],
						}))}
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

				<EuiFormRow display="rowCompressed">
					<EuiSwitch
						label="Use SWC during development" /* LOC */
						checked={projectCreateStore.useSwc}
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.useSwc = e.target.checked;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow display="rowCompressed">
					<EuiSwitch
						label="Install Route Sphere" /* LOC */
						checked={projectCreateStore.useRouteSphere}
						onChange={(e): void =>
							runInAction(() => {
								projectCreateStore.useRouteSphere =
									e.target.checked;
							})
						}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow display="rowCompressed">
					<EuiSwitch
						label="Generate stores" /* LOC */
						checked={projectCreateStore.generateStores}
						onChange={(e): void =>
							runInAction(() => {
								projectCreateStore.generateStores =
									e.target.checked;
							})
						}
						disabled={!projectCreateStore.useRouteSphere}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow display="rowCompressed">
					<EuiSwitch
						label="Configure custom proxy rules" /* LOC */
						checked={projectCreateStore.configureCustomProxyRules}
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.configureCustomProxyRules =
									e.target.checked;
							});
						}}
						compressed
					/>
				</EuiFormRow>

				<EuiFormRow display="rowCompressed">
					<EuiSwitch
						label="Use HTTPS" /* LOC */
						checked={projectCreateStore.useHttps}
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.useHttps = e.target.checked;
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
								disabled={projectCreateStore.useRouteSphere}
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
								disabled={projectCreateStore.useRouteSphere}
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
								disabled={projectCreateStore.useRouteSphere}
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
								disabled={projectCreateStore.useRouteSphere}
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
								disabled={projectCreateStore.useRouteSphere}
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

const TypeScriptViteReactProjectCreateModal = observer(
	(): React.ReactElement => {
		const [projectCreateStore] = React.useState(
			() => new TypeScriptViteReactProjectCreateStore(),
		);

		return (
			<>
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						Create a new project{/* LOC */}
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody>
					<TypeScriptViteReactProjectCreateForm
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
					<EuiButton
						size="s"
						href="https://github.com/ycanardeau/petunia"
						target="_blank"
					>
						GitHub
					</EuiButton>
				</EuiModalFooter>
			</>
		);
	},
);

export default TypeScriptViteReactProjectCreateModal;
