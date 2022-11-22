import { JsonObject, JsonObjectEntry } from '@/core/JsonValue';
import dependencies from '@/core/projects/dependencies.json' assert { type: 'json' };
import { orderBy } from 'lodash-es';

export class PackageJsonDependency {
	private readonly obj = new JsonObject();

	get entries(): JsonObjectEntry[] {
		return this.obj.entries;
	}

	addPackage = (name: keyof typeof dependencies): this => {
		this.obj.addEntry(name, dependencies[name]);
		return this;
	};

	orderByKey = (): JsonObject => {
		return new JsonObject(orderBy(this.obj.entries, (entry) => entry.key));
	};
}
