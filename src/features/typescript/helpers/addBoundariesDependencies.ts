import { PackageJsonDependency } from '@/features/common/projects/PackageJsonDependency';

export function addBoundariesDependencies(
	devDependenciesObj: PackageJsonDependency,
): void {
	devDependenciesObj.addPackage('eslint-plugin-boundaries');
}
