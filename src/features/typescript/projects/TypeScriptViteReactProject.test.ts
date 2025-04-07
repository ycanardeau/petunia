import dependencies from '@/features/common/projects/dependencies.json' assert { type: 'json' };
import { PackageManager } from '@/features/typescript/projects/PackageManager';
import { TestingFramework } from '@/features/typescript/projects/TypeScriptProject';
import {
	IconLibrary,
	OutputType,
	ReactMajorVersion,
	TypeScriptViteReactProject,
	UIFramework,
} from '@/features/typescript/projects/TypeScriptViteReactProject';
import { beforeAll, describe, expect, test } from 'vitest';

describe('TypeScriptViteReactProject', () => {
	let defaultProject: TypeScriptViteReactProject;

	beforeAll(() => {
		defaultProject = new TypeScriptViteReactProject(undefined, {});
	});

	test('isReactProject', () => {
		const actual = defaultProject.isReactProject;
		expect(actual).toBe(true);
	});

	test('generatePackageJson', () => {
		const actual = defaultProject.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson outputType ReactLibrary', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			outputType: OutputType.ReactLibrary,
			projectName: 'petunia',
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"name": "petunia",
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}",
		"vite-plugin-dts": "${dependencies['vite-plugin-dts']}"
	},
	"peerDependencies": {
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"files": [
		"dist"
	],
	"main": "./dist/index.cjs.js",
	"module": "./dist/index.es.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"import": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.es.js"
			},
			"require": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.cjs.js"
			}
		}
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson projectName invalid', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			projectName: '@petunia',
		});
		expect(() => project.generatePackageJson()).toThrowError(
			'Invalid project name',
		);
	});

	test('generatePackageJson projectName', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			projectName: 'petunia',
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"name": "petunia",
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson test Vitest', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			test: TestingFramework.Vitest,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}",
		"vitest": "${dependencies['vitest']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson ui ElasticUI', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			ui: UIFramework.ElasticUI,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"@elastic/datemath": "${dependencies['@elastic/datemath']}",
		"@elastic/eui": "${dependencies['@elastic/eui']}",
		"@emotion/cache": "${dependencies['@emotion/cache']}",
		"@emotion/css": "${dependencies['@emotion/css']}",
		"@emotion/react": "${dependencies['@emotion/react']}",
		"moment": "${dependencies['moment']}",
		"prop-types": "${dependencies['prop-types']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"typescript": "${dependencies['typescript']}",
		"utility-types": "${dependencies['utility-types']}",
		"vite": "${dependencies['vite']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson icon FluentSystemIcons', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			icon: IconLibrary.FluentSystemIcons,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"@fluentui/react-icons": "${dependencies['@fluentui/react-icons']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson enablePrettier', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			enablePrettier: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"prettier": "${dependencies['prettier']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson enablePrettier sortImports', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			enablePrettier: true,
			sortImports: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"eslint-plugin-simple-import-sort": "${dependencies['eslint-plugin-simple-import-sort']}",
		"prettier": "${dependencies['prettier']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson enableESLint', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			enableESLint: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@typescript-eslint/eslint-plugin": "${dependencies['@typescript-eslint/eslint-plugin']}",
		"@typescript-eslint/parser": "${dependencies['@typescript-eslint/parser']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"eslint": "${dependencies['eslint']}",
		"eslint-config-react-app": "${dependencies['eslint-config-react-app']}",
		"eslint-plugin-flowtype": "${dependencies['eslint-plugin-flowtype']}",
		"eslint-plugin-import": "${dependencies['eslint-plugin-import']}",
		"eslint-plugin-jsx-a11y": "${dependencies['eslint-plugin-jsx-a11y']}",
		"eslint-plugin-react": "${dependencies['eslint-plugin-react']}",
		"eslint-plugin-react-hooks": "${dependencies['eslint-plugin-react-hooks']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson enablePrettier enableESLint', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			enablePrettier: true,
			enableESLint: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@typescript-eslint/eslint-plugin": "${dependencies['@typescript-eslint/eslint-plugin']}",
		"@typescript-eslint/parser": "${dependencies['@typescript-eslint/parser']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"eslint": "${dependencies['eslint']}",
		"eslint-config-prettier": "${dependencies['eslint-config-prettier']}",
		"eslint-config-react-app": "${dependencies['eslint-config-react-app']}",
		"eslint-plugin-flowtype": "${dependencies['eslint-plugin-flowtype']}",
		"eslint-plugin-import": "${dependencies['eslint-plugin-import']}",
		"eslint-plugin-jsx-a11y": "${dependencies['eslint-plugin-jsx-a11y']}",
		"eslint-plugin-prettier": "${dependencies['eslint-plugin-prettier']}",
		"eslint-plugin-react": "${dependencies['eslint-plugin-react']}",
		"eslint-plugin-react-hooks": "${dependencies['eslint-plugin-react-hooks']}",
		"prettier": "${dependencies['prettier']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson useAjv', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			useAjv: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"ajv": "${dependencies['ajv']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson outputType ReactLibrary useAjv', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			outputType: OutputType.ReactLibrary,
			useAjv: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"ajv": "${dependencies['ajv']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}",
		"vite-plugin-dts": "${dependencies['vite-plugin-dts']}"
	},
	"peerDependencies": {
		"ajv": "${dependencies['ajv']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"files": [
		"dist"
	],
	"main": "./dist/index.cjs.js",
	"module": "./dist/index.es.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"import": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.es.js"
			},
			"require": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.cjs.js"
			}
		}
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson useLodash', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			useLodash: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"lodash-es": "${dependencies['lodash-es']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"devDependencies": {
		"@types/lodash-es": "${dependencies['@types/lodash-es']}",
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson outputType ReactLibrary useLodash', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			outputType: OutputType.ReactLibrary,
			useLodash: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"devDependencies": {
		"@types/lodash-es": "${dependencies['@types/lodash-es']}",
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"lodash-es": "${dependencies['lodash-es']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}",
		"vite-plugin-dts": "${dependencies['vite-plugin-dts']}"
	},
	"peerDependencies": {
		"lodash-es": "${dependencies['lodash-es']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"files": [
		"dist"
	],
	"main": "./dist/index.cjs.js",
	"module": "./dist/index.es.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"import": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.es.js"
			},
			"require": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.cjs.js"
			}
		}
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson useMobX', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			useMobX: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"mobx": "${dependencies['mobx']}",
		"mobx-react-lite": "${dependencies['mobx-react-lite']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson outputType ReactLibrary useMobX', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			outputType: OutputType.ReactLibrary,
			useMobX: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"mobx": "${dependencies['mobx']}",
		"mobx-react-lite": "${dependencies['mobx-react-lite']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}",
		"vite-plugin-dts": "${dependencies['vite-plugin-dts']}"
	},
	"peerDependencies": {
		"mobx": "${dependencies['mobx']}",
		"mobx-react-lite": "${dependencies['mobx-react-lite']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"files": [
		"dist"
	],
	"main": "./dist/index.cjs.js",
	"module": "./dist/index.es.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"import": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.es.js"
			},
			"require": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.cjs.js"
			}
		}
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson useQs', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			useQs: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"qs": "${dependencies['qs']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/qs": "${dependencies['@types/qs']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson outputType ReactLibrary useQs', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			outputType: OutputType.ReactLibrary,
			useQs: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/qs": "${dependencies['@types/qs']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"qs": "${dependencies['qs']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}",
		"vite-plugin-dts": "${dependencies['vite-plugin-dts']}"
	},
	"peerDependencies": {
		"qs": "${dependencies['qs']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}"
	},
	"files": [
		"dist"
	],
	"main": "./dist/index.cjs.js",
	"module": "./dist/index.es.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"import": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.es.js"
			},
			"require": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.cjs.js"
			}
		}
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson useReactRouter', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			useReactRouter: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}",
		"react-router-dom": "${dependencies['react-router-dom']}"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}"
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generatePackageJson outputType ReactLibrary useReactRouter', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			outputType: OutputType.ReactLibrary,
			useReactRouter: true,
		});
		const actual = project.generatePackageJson();
		const expected = `{
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "tsc && vite build",
		"preview": "vite preview"
	},
	"devDependencies": {
		"@types/node": "${dependencies['@types/node']}",
		"@types/react": "${dependencies['@types/react']}",
		"@types/react-dom": "${dependencies['@types/react-dom']}",
		"@vitejs/plugin-react": "${dependencies['@vitejs/plugin-react']}",
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}",
		"react-router-dom": "${dependencies['react-router-dom']}",
		"typescript": "${dependencies['typescript']}",
		"vite": "${dependencies['vite']}",
		"vite-plugin-dts": "${dependencies['vite-plugin-dts']}"
	},
	"peerDependencies": {
		"react": "${dependencies['react']}",
		"react-dom": "${dependencies['react-dom']}",
		"react-router-dom": "${dependencies['react-router-dom']}"
	},
	"files": [
		"dist"
	],
	"main": "./dist/index.cjs.js",
	"module": "./dist/index.es.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"import": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.es.js"
			},
			"require": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.cjs.js"
			}
		}
	}
}
`;
		expect(actual).toBe(expected);
	});

	test('generateTSConfigJson', () => {
		const actual = defaultProject.generateTSConfigJson();
		const expected = `{
	"compilerOptions": {
		"target": "ESNext",
		"useDefineForClassFields": true,
		"lib": [
			"DOM",
			"DOM.Iterable",
			"ESNext"
		],
		"allowJs": false,
		"skipLibCheck": true,
		"esModuleInterop": false,
		"allowSyntheticDefaultImports": true,
		"strict": true,
		"forceConsistentCasingInFileNames": true,
		"module": "ESNext",
		"moduleResolution": "Node",
		"resolveJsonModule": true,
		"isolatedModules": true,
		"noEmit": true,
		"jsx": "react-jsx"
	},
	"include": [
		"src"
	],
	"references": [
		{
			"path": "./tsconfig.node.json"
		}
	]
}
`;
		expect(actual).toBe(expected);
	});

	test('generateTSConfigJson configurePathAliases', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			configurePathAliases: true,
		});
		const actual = project.generateTSConfigJson();
		const expected = `{
	"compilerOptions": {
		"target": "ESNext",
		"useDefineForClassFields": true,
		"lib": [
			"DOM",
			"DOM.Iterable",
			"ESNext"
		],
		"allowJs": false,
		"skipLibCheck": true,
		"esModuleInterop": false,
		"allowSyntheticDefaultImports": true,
		"strict": true,
		"forceConsistentCasingInFileNames": true,
		"module": "ESNext",
		"moduleResolution": "Node",
		"resolveJsonModule": true,
		"isolatedModules": true,
		"noEmit": true,
		"jsx": "react-jsx",
		"baseUrl": "./",
		"paths": {
			"@/*": [
				"src/*"
			]
		}
	},
	"include": [
		"src"
	],
	"references": [
		{
			"path": "./tsconfig.node.json"
		}
	]
}
`;
		expect(actual).toBe(expected);
	});

	test('generateTSConfigJson useMobX', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			useMobX: true,
		});
		const actual = project.generateTSConfigJson();
		const expected = `{
	"compilerOptions": {
		"target": "ESNext",
		"useDefineForClassFields": true,
		"lib": [
			"DOM",
			"DOM.Iterable",
			"ESNext"
		],
		"allowJs": false,
		"skipLibCheck": true,
		"esModuleInterop": false,
		"allowSyntheticDefaultImports": true,
		"strict": true,
		"forceConsistentCasingInFileNames": true,
		"module": "ESNext",
		"moduleResolution": "Node",
		"resolveJsonModule": true,
		"isolatedModules": true,
		"noEmit": true,
		"jsx": "react-jsx",
		"experimentalDecorators": true
	},
	"include": [
		"src"
	],
	"references": [
		{
			"path": "./tsconfig.node.json"
		}
	]
}
`;
		expect(actual).toBe(expected);
	});

	test('generateTSConfigNodeJson', () => {
		const actual = defaultProject.generateTSConfigNodeJson();
		const expected = `{
	"compilerOptions": {
		"composite": true,
		"module": "ESNext",
		"moduleResolution": "Node",
		"allowSyntheticDefaultImports": true
	},
	"include": [
		"vite.config.ts"
	]
}
`;
		expect(actual).toBe(expected);
	});

	test('generateIndexHtml', () => {
		const actual = defaultProject.generateIndexHtml();
		const expected = `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title></title>
	</head>
	<body>
		<div id="root"></div>
		<script type="module" src="/src/main.tsx"></script>
	</body>
</html>
`;
		expect(actual).toBe(expected);
	});

	test('generateViteConfigTS', () => {
		const actual = defaultProject.generateViteConfigTS();
		const expected = `import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
	],
	server: {},
});
`;
		expect(actual).toBe(expected);
	});

	test('generateViteConfigTS outputType ReactLibrary', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			outputType: OutputType.ReactLibrary,
		});
		const actual = project.generateViteConfigTS();
		const expected = `import pkg from './package.json' assert { type: 'json' };
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		dts({
			insertTypesEntry: true,
		}),
		react({
			jsxRuntime: 'classic',
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			formats: [
				'es',
				'cjs',
			],
			fileName: (format) => \`index.\${format}.js\`,
		},
		rollupOptions: {
			external: [
				...Object.keys(pkg.peerDependencies ?? []),
				...Object.keys(pkg.dependencies ?? []),
			],
		},
		sourcemap: true,
	},
	server: {},
});
`;
		expect(actual).toBe(expected);
	});

	test('generateViteConfigTS configurePathAliases', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			configurePathAliases: true,
		});
		const actual = project.generateViteConfigTS();
		const expected = `import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	plugins: [
		react(),
	],
	server: {},
});
`;
		expect(actual).toBe(expected);
	});

	test('generateViteConfigTS ui ElasticUI', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			ui: UIFramework.ElasticUI,
		});
		const actual = project.generateViteConfigTS();
		const expected = `import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
	],
	build: {
		dynamicImportVarsOptions: {
			exclude: [],
		},
	},
	server: {},
});
`;
		expect(actual).toBe(expected);
	});

	test('generateViteConfigTS configureCustomProxyRules', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			configureCustomProxyRules: true,
		});
		const actual = project.generateViteConfigTS();
		const expected = `import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
	],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:5000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\\/api/, ''),
				headers: {
					'x-real-ip': 'localhost',
				},
			},
		},
	},
});
`;
		expect(actual).toBe(expected);
	});

	test('generateViteConfigTS publicBasePath web-app', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			publicBasePath: 'web-app',
		});
		const actual = project.generateViteConfigTS();
		const expected = `import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
	],
	server: {},
	base: process.env.NODE_ENV === 'production' ? '/web-app/' : './',
});
`;
		expect(actual).toBe(expected);
	});

	test('generateSrcAppTsx', () => {
		const actual = defaultProject.generateSrcAppTsx();
		const expected = `import React from 'react';

const App = (): React.ReactElement => {
	return <></>;
};

export default App;
`;
		expect(actual).toBe(expected);
	});

	test('generateSrcAppTsx ui ElasticUI', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			ui: UIFramework.ElasticUI,
		});
		const actual = project.generateSrcAppTsx();
		const expected = `import '@/icons';
import { EuiProvider } from '@elastic/eui';
import createCache from '@emotion/cache';
import React from 'react';

// https://elastic.github.io/eui/#/utilities/provider
const euiCache = createCache({
	key: 'eui',
	container: document.querySelector('meta[name="eui-style-insert"]') as Node,
});
euiCache.compat = true;

const App = (): React.ReactElement => {
	return <EuiProvider colorMode="dark" cache={euiCache}></EuiProvider>;
};

export default App;
`;
		expect(actual).toBe(expected);
	});

	test('generateSrcMainTsx', () => {
		const actual = defaultProject.generateSrcMainTsxForReact();

		const reactMajorVersion = 17 as ReactMajorVersion;
		switch (reactMajorVersion) {
			case 17: {
				const expected = `import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root') as HTMLElement,
);
`;
				expect(actual).toBe(expected);
				break;
			}

			case 18: {
				const expected = `import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
`;
				expect(actual).toBe(expected);
				break;
			}
		}
	});

	test('generateSrcMainTsx configurePathAliases', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			configurePathAliases: true,
		});
		const actual = project.generateSrcMainTsxForReact();

		const reactMajorVersion = 17 as ReactMajorVersion;
		switch (reactMajorVersion) {
			case 17: {
				const expected = `import App from '@/App';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root') as HTMLElement,
);
`;
				expect(actual).toBe(expected);
				break;
			}

			case 18: {
				const expected = `import App from '@/App';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
`;
				expect(actual).toBe(expected);
				break;
			}
		}
	});

	test('generateSrcViteEnvDTS', () => {
		const actual = defaultProject.generateSrcViteEnvDTS();
		const expected = `/// <reference types="vite/client" />
`;
		expect(actual).toBe(expected);
	});

	test('generateDockerfile', () => {
		const actual = defaultProject.generateDockerfile();
		const expected = `FROM node:20-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
`;

		expect(actual).toBe(expected);
	});

	test('generateDockerfile packageManager Pnpm', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			packageManager: PackageManager.Pnpm,
		});
		const actual = project.generateDockerfile();
		const expected = `FROM node:20-alpine as build

WORKDIR /app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
`;

		expect(actual).toBe(expected);
	});

	test('generateProjectFiles', () => {
		const actual = Array.from(defaultProject.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = [
			'.editorconfig',
			'.gitignore',
			'package.json',
			'tsconfig.json',
			'tsconfig.node.json',
			'index.html',
			'vite.config.ts',
			'src/App.tsx',
			'src/main.tsx',
			'src/vite-env.d.ts',
		];
		expect(actual).toEqual(expected);
	});

	test('generateProjectFiles enablePrettier', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			enablePrettier: true,
		});
		const actual = Array.from(project.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = [
			'.editorconfig',
			'.prettierrc.json',
			'.gitignore',
			'package.json',
			'tsconfig.json',
			'tsconfig.node.json',
			'index.html',
			'vite.config.ts',
			'src/App.tsx',
			'src/main.tsx',
			'src/vite-env.d.ts',
		];
		expect(actual).toEqual(expected);
	});

	test('generateProjectFiles enableESLint', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			enableESLint: true,
		});
		const actual = Array.from(project.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = [
			'.editorconfig',
			'.eslintrc.cjs',
			'.gitignore',
			'package.json',
			'tsconfig.json',
			'tsconfig.node.json',
			'index.html',
			'vite.config.ts',
			'src/App.tsx',
			'src/main.tsx',
			'src/vite-env.d.ts',
		];
		expect(actual).toEqual(expected);
	});

	test('generateProjectFiles ui ElasticUI', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			ui: UIFramework.ElasticUI,
		});
		const actual = Array.from(project.generateProjectFiles()).map(
			(projectFile) => projectFile.path,
		);
		const expected = [
			'.editorconfig',
			'.gitignore',
			'package.json',
			'tsconfig.json',
			'tsconfig.node.json',
			'index.html',
			'vite.config.ts',
			'src/App.tsx',
			'src/main.tsx',
			'src/vite-env.d.ts',
			'src/global.d.ts',
			'src/icons.ts',
		];
		expect(actual).toEqual(expected);
	});
});
