import { JsonObject } from '@/core/JsonValue';
import dependencies from '@/core/projects/dependencies.json';
import { orderBy } from 'lodash-es';

export class PackageJsonDependency {
	private readonly obj = new JsonObject();

	addPackage = (name: keyof typeof dependencies): this => {
		this.obj.addEntry(name, dependencies[name]);
		return this;
	};

	orderByKey = (): JsonObject => {
		return new JsonObject(orderBy(this.obj.entries, (entry) => entry.key));
	};
}
