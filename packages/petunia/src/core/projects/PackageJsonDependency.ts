import { JsonObject } from '@/core/JsonValue';
import npmPackages from '@/core/projects/npmPackages';
import { orderBy } from 'lodash-es';

export class PackageJsonDependency {
	private readonly obj = new JsonObject();

	addPackage = (name: keyof typeof npmPackages): this => {
		this.obj.addEntry(name, npmPackages[name]);
		return this;
	};

	orderByKey = (): JsonObject => {
		return new JsonObject(orderBy(this.obj.entries, (entry) => entry.key));
	};
}
