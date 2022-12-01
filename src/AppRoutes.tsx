import { TypeScriptViteReactProjectCreateModal } from '@/ui/components/TypeScriptViteReactProjectCreateModal';
import { Navigate, Route, Routes } from 'react-router-dom';

export const AppRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="" element={<Navigate to="/projects" />} />
			<Route
				path="projects/*"
				element={
					<Routes>
						<Route
							path=""
							element={
								<Navigate to="/projects/typescript-vite-react" />
							}
						/>
						<Route
							path="typescript-vite-react"
							element={<TypeScriptViteReactProjectCreateModal />}
						/>
					</Routes>
				}
			/>
		</Routes>
	);
};
