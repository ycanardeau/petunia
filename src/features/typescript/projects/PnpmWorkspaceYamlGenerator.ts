import { SourceTextGenerator } from '@/features/common/projects/SourceTextGenerator';
import {
	catalog,
	isCatalogDependency,
} from '@/features/common/projects/dependencies';

interface PnpmWorkspaceYamlOptions {
	packageJson: string;
}

const dependencyFields = [
	'dependencies',
	'devDependencies',
	'peerDependencies',
] as const;

// pnpm refuses to install until these build scripts are allowed.
const buildDependencies: Record<string, string[]> = {
	'eslint-import-resolver-typescript': ['unrs-resolver'],
};

// Allows the build scripts pnpm would otherwise block, and lists the shared catalog versions of every package that package.json
// references with `catalog:`. Run `pnpm dlx @aigamo/catalog` to update them.
export class PnpmWorkspaceYamlGenerator extends SourceTextGenerator<PnpmWorkspaceYamlOptions> {
	generate(): string {
		const packageJson: Partial<
			Record<(typeof dependencyFields)[number], Record<string, string>>
		> = JSON.parse(this.options.packageJson);

		const names = new Set<string>();
		const allowBuilds = new Set<string>();
		for (const field of dependencyFields) {
			for (const [name, version] of Object.entries(
				packageJson[field] ?? {},
			)) {
				if (version === 'catalog:' && isCatalogDependency(name)) {
					names.add(name);
				}
				for (const buildDependency of buildDependencies[name] ?? []) {
					allowBuilds.add(buildDependency);
				}
			}
		}

		const lines: string[] = [];
		if (allowBuilds.size > 0) {
			lines.push('allowBuilds:');
			for (const name of [...allowBuilds].sort()) {
				lines.push(`  ${name}: true`);
			}
			lines.push('');
		}
		lines.push('catalog:');
		for (const name of [...names].sort()) {
			const key = /^[\w.-]+$/.test(name) ? name : `'${name}'`;
			lines.push(`  ${key}: ${catalog[name as keyof typeof catalog]}`);
		}
		return this.joinLines(lines);
	}
}
