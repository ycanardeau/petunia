type FormatStyle = 'Json' | 'JavaScript';

interface FormatOptions {
	tab: string;
	newLine: string;
	style: FormatStyle;
}

abstract class JsonValue {
	abstract toString(): string;

	toFormattedString(_options: FormatOptions, _tabCount?: number): string {
		return this.toString();
	}
}

export class JsonLiteral extends JsonValue {
	constructor(readonly value: string) {
		super();
	}

	toString(): string {
		return this.value;
	}
}

export class JsonUndefined extends JsonValue {
	toString(): string {
		return 'undefined';
	}
}

export class JsonNull extends JsonValue {
	toString(): string {
		return 'null';
	}
}

export class JsonBoolean extends JsonValue {
	constructor(readonly value: boolean) {
		super();
	}

	toString(): string {
		return this.value ? 'true' : 'false';
	}
}

export class JsonNumber extends JsonValue {
	constructor(readonly value: number) {
		super();
	}

	toString(): string {
		return this.value.toString();
	}
}

export class JsonString extends JsonValue {
	constructor(readonly value: string) {
		super();
	}

	toString(): string {
		return `"${this.value}"`;
	}

	toFormattedString(options: FormatOptions): string {
		switch (options.style) {
			case 'Json':
				return `"${this.value}"`;

			case 'JavaScript':
				return `'${this.value}'`;
		}
	}
}

export class JsonArray extends JsonValue {
	constructor(readonly items: JsonValue[] = []) {
		super();
	}

	addItem(item: boolean | number | string | JsonValue): this {
		switch (typeof item) {
			case 'boolean':
				this.items.push(new JsonBoolean(item));
				break;

			case 'number':
				this.items.push(new JsonNumber(item));
				break;

			case 'string':
				this.items.push(new JsonString(item));
				break;

			default:
				this.items.push(item);
				break;
		}
		return this;
	}

	toString(): string {
		return `[${this.items.join(',')}]`;
	}

	toFormattedString(options: FormatOptions, tabCount = 0): string {
		const itemToString = (
			item: JsonValue,
			options: FormatOptions,
			tabCount: number,
		): string => {
			const indent = options.tab.repeat(tabCount);
			return `${indent}${item.toFormattedString(options, tabCount)}`;
		};

		const itemsToString = (
			items: JsonValue[],
			options: FormatOptions,
			tabCount: number,
		): string => {
			const itemsString = items
				.map((item) => itemToString(item, options, tabCount))
				.join(`,${options.newLine}`);
			return options.style === 'JavaScript'
				? `${itemsString},`
				: itemsString;
		};

		const indent = options.tab.repeat(tabCount);
		return this.items.length > 0
			? `[${options.newLine}${itemsToString(
					this.items,
					options,
					tabCount + 1,
				)}${options.newLine}${indent}]`
			: '[]';
	}
}

export interface JsonObjectEntry {
	key: string;
	value: JsonValue;
}

export class JsonObject extends JsonValue {
	constructor(readonly entries: JsonObjectEntry[] = []) {
		super();
	}

	addEntry(
		key: string,
		value: boolean | number | string | JsonValue | undefined,
	): this {
		switch (typeof value) {
			case 'undefined':
				// nop
				break;

			case 'boolean':
				this.entries.push({ key: key, value: new JsonBoolean(value) });
				break;

			case 'number':
				this.entries.push({ key: key, value: new JsonNumber(value) });
				break;

			case 'string':
				this.entries.push({ key: key, value: new JsonString(value) });
				break;

			default:
				this.entries.push({ key: key, value: value });
				break;
		}
		return this;
	}

	toString(): string {
		return `{${this.entries
			.map(({ key, value }) => `"${key}":${value}`)
			.join(',')}}`;
	}

	toFormattedString(options: FormatOptions, tabCount = 0): string {
		const entryToString = (
			{ key, value }: JsonObjectEntry,
			options: FormatOptions,
			tabCount: number,
		): string => {
			const indent = options.tab.repeat(tabCount);
			let entryString = indent;

			switch (options.style) {
				case 'Json':
					entryString += `"${key}"`;
					break;

				case 'JavaScript':
					if (
						key.includes('-') ||
						key.includes('@') ||
						key.includes('/')
					) {
						entryString += `'${key}'`;
					} else {
						entryString += key;
					}
					break;
			}

			entryString += `: ${value.toFormattedString(options, tabCount)}`;

			return entryString;
		};

		const entriesToString = (
			entries: JsonObjectEntry[],
			options: FormatOptions,
			tabCount: number,
		): string => {
			const entriesString = entries
				.map((entry) => entryToString(entry, options, tabCount))
				.join(`,${options.newLine}`);
			return options.style === 'JavaScript'
				? `${entriesString},`
				: entriesString;
		};

		const indent = options.tab.repeat(tabCount);
		return this.entries.length > 0
			? `{${options.newLine}${entriesToString(
					this.entries,
					options,
					tabCount + 1,
				)}${options.newLine}${indent}}`
			: '{}';
	}
}
