import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const TypeScriptNestProjectCreateModal = React.lazy(
	() => import('@/ui/components/TypeScriptNestProjectModal'),
);
const TypeScriptNodeConsoleProjectCreateModal = React.lazy(
	() => import('@/ui/components/TypeScriptNodeConsoleProjectModal'),
);
const TypeScriptViteReactProjectCreateModal = React.lazy(
	() => import('@/ui/components/TypeScriptViteReactProjectCreateModal'),
);
const TypeScriptYohiraProjectCreateModal = React.lazy(
	() => import('@/ui/components/TypeScriptYohiraProjectCreateModal'),
);

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
						<Route
							path="typescript-node-console"
							element={
								<TypeScriptNodeConsoleProjectCreateModal />
							}
						/>
						<Route
							path="typescript-yohira"
							element={<TypeScriptYohiraProjectCreateModal />}
						/>
						<Route
							path="typescript-nest"
							element={<TypeScriptNestProjectCreateModal />}
						/>
					</Routes>
				}
			/>
		</Routes>
	);
};
