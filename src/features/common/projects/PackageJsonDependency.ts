import { JsonObject, type JsonObjectEntry } from '@/core/JsonValue';
import {
	type DependencyName,
	dependencies,
	isCatalogDependency,
} from '@/features/common/projects/dependencies';
import { orderBy } from 'lodash-es';

export class PackageJsonDependency {
	private readonly obj = new JsonObject();

	/**
	 * @param useCatalog Reference packages from the shared catalog with the
	 * pnpm `catalog:` protocol instead of writing their versions.
	 */
	constructor(private readonly useCatalog = false) {}

	get entries(): JsonObjectEntry[] {
		return this.obj.entries;
	}

	addPackage(name: DependencyName, version?: string): this {
		this.obj.addEntry(
			name,
			version ??
				(this.useCatalog && isCatalogDependency(name)
					? 'catalog:'
					: dependencies[name]),
		);
		return this;
	}

	addTypeScript(): this {
		return this.addPackage('typescript').addPackage(
			'@typescript/typescript6',
		);
	}

	orderByKey(): JsonObject {
		return new JsonObject(orderBy(this.obj.entries, (entry) => entry.key));
	}
}
