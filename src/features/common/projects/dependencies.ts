import localDependencies from '@/features/common/projects/dependencies.json' with { type: 'json' };
import sharedCatalog from '@aigamo/catalog/catalog.json' with { type: 'json' };

// Versions shared across @aigamo projects. dependencies.json only lists the
// packages that the shared catalog doesn't cover.
export const catalog = sharedCatalog.catalog;

export const dependencies = { ...localDependencies, ...catalog };

export type DependencyName = keyof typeof dependencies;

export function isCatalogDependency(
	name: string,
): name is keyof typeof catalog {
	return Object.hasOwn(catalog, name);
}
