export enum PackageManager {
	Npm = 'Npm',
	Pnpm = 'Pnpm',
}

export const packageManagerNames = {
	[PackageManager.Npm]: 'npm',
	[PackageManager.Pnpm]: 'pnpm',
};
