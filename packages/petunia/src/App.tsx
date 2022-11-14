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
	EuiProvider,
	EuiSelect,
	EuiSwitch,
} from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import createCache from '@emotion/cache';
import React from 'react';

// https://elastic.github.io/eui/#/utilities/provider
const euiCache = createCache({
	key: 'eui',
	container: document.querySelector('meta[name="eui-style-insert"]') as Node,
});
euiCache.compat = true;

const App = (): React.ReactElement => {
	return (
		<EuiProvider colorMode="dark" cache={euiCache}>
			<EuiModal onClose={(): void => {}}>
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						Create a new project{/* LOC */}
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody>
					<EuiForm>
						<EuiFormRow
							label="Project type" /* LOC */
							display="rowCompressed"
						>
							<EuiSelect
								options={[{ value: 'React', text: 'React' }]}
								compressed
							/>
						</EuiFormRow>

						<EuiFormRow
							label="Project name" /* LOC */
							display="rowCompressed"
						>
							<EuiFieldText compressed />
						</EuiFormRow>

						<EuiFormRow
							label="Build tool" /* LOC */
							display="rowCompressed"
						>
							<EuiSelect
								options={[{ value: 'Vite', text: 'Vite' }]}
								compressed
							/>
						</EuiFormRow>

						<EuiFormRow
							label="UI" /* LOC */
							display="rowCompressed"
						>
							<EuiSelect
								options={[
									{ value: 'None', text: 'None' },
									{
										value: 'Elastic UI',
										text: 'Elastic UI',
									},
								]}
								compressed
							/>
						</EuiFormRow>

						<EuiFormRow display="rowCompressed">
							<EuiSwitch
								label="Sort import declarations" /* LOC */
								checked={true}
								onChange={(): void => {}}
								compressed
							/>
						</EuiFormRow>

						<EuiFormRow display="rowCompressed">
							<EuiSwitch
								label="Configure path aliases" /* LOC */
								checked={true}
								onChange={(): void => {}}
								compressed
							/>
						</EuiFormRow>

						<EuiFormRow label="Lodash" display="rowCompressed">
							<EuiSwitch
								label="Use Lodash for this project." /* LOC */
								checked={false}
								onChange={(): void => {}}
								compressed
							/>
						</EuiFormRow>

						<EuiFormRow label="MobX" display="rowCompressed">
							<EuiSwitch
								label="Use MobX for this project." /* LOC */
								checked={false}
								onChange={(): void => {}}
								compressed
							/>
						</EuiFormRow>

						<EuiFormRow
							label="React Router"
							display="rowCompressed"
						>
							<EuiSwitch
								label="Use React Router for this project." /* LOC */
								checked={false}
								onChange={(): void => {}}
								compressed
							/>
						</EuiFormRow>

						<EuiFormRow label="qs" display="rowCompressed">
							<EuiSwitch
								label="Use qs for this project." /* LOC */
								checked={false}
								onChange={(): void => {}}
								compressed
							/>
						</EuiFormRow>
					</EuiForm>
				</EuiModalBody>

				<EuiModalFooter>
					<EuiButton fill size="s">
						Create{/* LOC */}
					</EuiButton>
				</EuiModalFooter>
			</EuiModal>
		</EuiProvider>
	);
};

export default App;
