import { orderBy, uniq } from 'lodash-es';

abstract class JavaScriptImport {
	constructor(readonly moduleName: string) {}

	abstract toString(): string;
}

export class JavaScriptNamedImport extends JavaScriptImport {
	private readonly names: string[] = [];

	addNamedExport = (name?: string): this => {
		if (name !== undefined) this.names.push(name);
		return this;
	};

	addNamedExports = (...names: (string | undefined)[]): this => {
		if (names !== undefined) {
			this.names.push(
				...names
					.filter((name) => name !== undefined)
					.map((name) => name!),
			);
		}
		return this;
	};

	toString = (): string => {
		const namesString = orderBy(uniq(this.names), (name) => name).join(
			', ',
		);
		return `import { ${namesString} } from '${this.moduleName}';`;
	};
}

export class JavaScriptDefaultImport extends JavaScriptImport {
	constructor(
		readonly defaultExport: string,
		moduleName: string,
		readonly assertions = '',
	) {
		super(moduleName);
	}

	toString = (): string => {
		return `import ${this.defaultExport} from '${this.moduleName}'${this.assertions};`;
	};
}

interface FormatOptions {
	newLine: string;
}

export class JavaScriptImports {
	private readonly values: JavaScriptImport[] = [];

	addImport = (value?: JavaScriptImport): this => {
		if (value !== undefined) this.values.push(value);
		return this;
	};

	addImports = (...values: (JavaScriptImport | undefined)[]): this => {
		if (values !== undefined) {
			this.values.push(
				...values
					.filter((value) => value !== undefined)
					.map((value) => value!),
			);
		}
		return this;
	};

	toFormattedString = ({ newLine }: FormatOptions): string => {
		return orderBy(this.values, (value) => value.moduleName).join(newLine);
	};
}
