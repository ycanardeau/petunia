import { TestingFramework } from '@/core/projects/TypeScriptProject';
import {
	IconLibrary,
	UIFramework,
} from '@/core/projects/TypeScriptViteReactProject';
import {
	iconLibraryNames,
	uiFrameworkNames,
} from '@/ui/components/TypeScriptViteReactProjectCreateModal';
import { testingFrameworkNames } from '@/ui/components/constants';
import { TypeScriptYohiraProjectCreateStore } from '@/ui/stores/TypeScriptYohiraProjectCreateStore';
import {
	EuiButton,
	EuiFieldText,
	EuiForm,
	EuiFormRow,
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

interface TypeScriptYohiraProjectCreateFormProps {
	projectCreateStore: TypeScriptYohiraProjectCreateStore;
}

const TypeScriptYohiraProjectCreateForm = observer(
	({
		projectCreateStore,
	}: TypeScriptYohiraProjectCreateFormProps): React.ReactElement => {
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
			</EuiForm>
		);
	},
);

const TypeScriptYohiraProjectCreateModal = observer((): React.ReactElement => {
	const [projectCreateStore] = React.useState(
		() => new TypeScriptYohiraProjectCreateStore(),
	);

	return (
		<>
			<EuiModalHeader>
				<EuiModalHeaderTitle>
					Create a new project{/* LOC */}
				</EuiModalHeaderTitle>
			</EuiModalHeader>

			<EuiModalBody>
				<TypeScriptYohiraProjectCreateForm
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
});

export default TypeScriptYohiraProjectCreateModal;
