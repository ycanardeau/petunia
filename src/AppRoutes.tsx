import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const TypeScriptNestProjectCreateModal = React.lazy(
	() => import('@/features/typescript/components/TypeScriptNestProjectModal'),
);
const TypeScriptNodeConsoleProjectCreateModal = React.lazy(
	() =>
		import(
			'@/features/typescript/components/TypeScriptNodeConsoleProjectModal'
		),
);
const TypeScriptViteReactProjectCreateModal = React.lazy(
	() =>
		import(
			'@/features/typescript/components/TypeScriptViteReactProjectCreateModal'
		),
);
const TypeScriptYohiraProjectCreateModal = React.lazy(
	() =>
		import(
			'@/features/typescript/components/TypeScriptYohiraProjectCreateModal'
		),
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
								<Navigate to="/projects/typescript-yohira" />
							}
						/>
						<Route
							path="typescript-yohira"
							element={<TypeScriptYohiraProjectCreateModal />}
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
							path="typescript-nest"
							element={<TypeScriptNestProjectCreateModal />}
						/>
					</Routes>
				}
			/>
		</Routes>
	);
};
