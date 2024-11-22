import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const TypeScriptNestProjectCreateModal = lazy(
	() => import('@/features/typescript/components/TypeScriptNestProjectModal'),
);
const TypeScriptNodeConsoleProjectCreateModal = lazy(
	() =>
		import(
			'@/features/typescript/components/TypeScriptNodeConsoleProjectModal'
		),
);
const TypeScriptViteReactProjectCreateModal = lazy(
	() =>
		import(
			'@/features/typescript/components/TypeScriptViteReactProjectCreateModal'
		),
);
const TypeScriptYohiraProjectCreateModal = lazy(
	() =>
		import(
			'@/features/typescript/components/TypeScriptYohiraProjectCreateModal'
		),
);

const FSharpFableProjectCreateModal = lazy(
	() => import('@/features/fsharp/components/FSharpFableProjectCreateModal'),
);

const CSharpCleanArchitectureProjectModal = lazy(
	() =>
		import(
			'@/features/csharp/components/CSharpCleanArchitectureProjectModal'
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
						<Route
							path="fsharp-fable"
							element={<FSharpFableProjectCreateModal />}
						/>
						<Route
							path="csharp-clean-architecture"
							element={<CSharpCleanArchitectureProjectModal />}
						/>
					</Routes>
				}
			/>
		</Routes>
	);
};
