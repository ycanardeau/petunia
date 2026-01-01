import {
	PackageManager,
	packageManagerNames,
} from '@/features/csharp/projects/PackageManager';
import { CSharpAspNetCoreProjectCreateStore } from '@/features/csharp/stores/CSharpAspNetCoreProjectCreateStore';
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

interface CSharpAspNetCoreProjectCreateFormProps {
	projectCreateStore: CSharpAspNetCoreProjectCreateStore;
}

const CSharpAspNetCoreProjectCreateForm = observer(
	({
		projectCreateStore,
	}: CSharpAspNetCoreProjectCreateFormProps): ReactElement => {
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
			</EuiForm>
		);
	},
);

const CSharpAspNetCoreProjectModal = (): ReactElement => {
	const [projectCreateStore] = useState(
		() => new CSharpAspNetCoreProjectCreateStore(),
	);

	return (
		<>
			<EuiModalHeader>
				<EuiModalHeaderTitle>
					Create a new project{/* LOC */}
				</EuiModalHeaderTitle>
			</EuiModalHeader>

			<EuiModalBody>
				<CSharpAspNetCoreProjectCreateForm
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

export default CSharpAspNetCoreProjectModal;
