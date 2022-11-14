import {
	EuiButton,
	EuiModal,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
	EuiProvider,
} from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import React from 'react';

const App = (): React.ReactElement => {
	return (
		<EuiProvider colorMode="dark">
			<EuiModal onClose={(): void => {}}>
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						Create a new project{/* LOC */}
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody></EuiModalBody>

				<EuiModalFooter>
					<EuiButton fill>Create{/* LOC */}</EuiButton>
				</EuiModalFooter>
			</EuiModal>
		</EuiProvider>
	);
};

export default App;
