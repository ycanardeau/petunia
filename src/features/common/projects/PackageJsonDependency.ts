import { JsonObject, JsonObjectEntry } from '@/core/JsonValue';
import dependencies from '@/features/common/projects/dependencies.json' assert { type: 'json' };
import { orderBy } from 'lodash-es';

export class PackageJsonDependency {
	private readonly obj = new JsonObject();

	get entries(): JsonObjectEntry[] {
		return this.obj.entries;
	}

	addPackage(name: keyof typeof dependencies, version?: string): this {
		this.obj.addEntry(name, version ?? dependencies[name]);
		return this;
	}

	orderByKey(): JsonObject {
		return new JsonObject(orderBy(this.obj.entries, (entry) => entry.key));
	}
}
