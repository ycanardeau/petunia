import { Database, databaseNames } from '@/features/csharp/projects/Database';
import {
	PackageManager,
	packageManagerNames,
} from '@/features/csharp/projects/PackageManager';
import { CSharpCleanArchitectureProjectCreateStore } from '@/features/csharp/stores/CSharpCleanArchitectureProjectCreateStore';
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
import { type ReactElement, useState } from 'react';

interface CSharpCleanArchitectureProjectCreateFormProps {
	projectCreateStore: CSharpCleanArchitectureProjectCreateStore;
}

const CSharpCleanArchitectureProjectCreateForm = observer(
	({
		projectCreateStore,
	}: CSharpCleanArchitectureProjectCreateFormProps): ReactElement => {
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

				<EuiFormRow label="Database" /* LOC */ display="rowCompressed">
					<EuiSelect
						options={Object.values(Database).map((value) => ({
							value: value,
							text: databaseNames[value],
						}))}
						value={projectCreateStore.database}
						onChange={(e): void => {
							runInAction(() => {
								projectCreateStore.database = e.target
									.value as Database;
							});
						}}
						compressed
					/>
				</EuiFormRow>
			</EuiForm>
		);
	},
);

const CSharpCleanArchitectureProjectModal = (): ReactElement => {
	const [projectCreateStore] = useState(
		() => new CSharpCleanArchitectureProjectCreateStore(),
	);

	return (
		<>
			<EuiModalHeader>
				<EuiModalHeaderTitle>
					Create a new project{/* LOC */}
				</EuiModalHeaderTitle>
			</EuiModalHeader>

			<EuiModalBody>
				<CSharpCleanArchitectureProjectCreateForm
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
};

export default CSharpCleanArchitectureProjectModal;
