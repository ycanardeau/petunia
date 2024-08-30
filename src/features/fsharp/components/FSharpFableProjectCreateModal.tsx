import {
	PackageManager,
	packageManagerNames,
} from '@/features/fsharp/projects/PackageManager';
import {
	TargetLanguage,
	targetLanguageNames,
} from '@/features/fsharp/projects/TargetLanguage';
import { FSharpFableProjectCreateStore } from '@/features/fsharp/stores/FSharpFableProjectCreateStore';
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
} from '@elastic/eui';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

interface FSharpFableProjectCreateFormProps {
	projectCreateStore: FSharpFableProjectCreateStore;
}

const FSharpFableProjectCreateForm = observer(
	({
		projectCreateStore,
	}: FSharpFableProjectCreateFormProps): React.ReactElement => {
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
					label="Target language" /* LOC */
					display="rowCompressed"
				>
					<EuiSelect
						options={Object.values(TargetLanguage).map((value) => ({
							value: value,
							text: targetLanguageNames[value],
						}))}
						value={projectCreateStore.targetLanguage}
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.targetLanguage = e.target
									.value as TargetLanguage;
							});
						}}
						compressed
					/>
				</EuiFormRow>
			</EuiForm>
		);
	},
);

const FSharpFableProjectCreateModal = observer((): React.ReactElement => {
	const [projectCreateStore] = React.useState(
		() => new FSharpFableProjectCreateStore(),
	);

	return (
		<>
			<EuiModalHeader>
				<EuiModalHeaderTitle>
					Create a new project{/* LOC */}
				</EuiModalHeaderTitle>
			</EuiModalHeader>

			<EuiModalBody>
				<FSharpFableProjectCreateForm
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

export default FSharpFableProjectCreateModal;
