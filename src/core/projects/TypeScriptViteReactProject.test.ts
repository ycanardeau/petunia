import {
	IconLibrary,
	TestingFramework,
	TypeScriptViteReactProject,
	UIFramework,
} from '@/core/projects/TypeScriptViteReactProject';
import { beforeAll, describe, expect, test } from 'vitest';

describe('TypeScriptViteReactProject', () => {
	let defaultProject: TypeScriptViteReactProject;

	beforeAll(() => {
		defaultProject = new TypeScriptViteReactProject(undefined, {});
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
		"react": "^18.2.0",
		"react-dom": "^18.2.0"
	},
	"devDependencies": {
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@vitejs/plugin-react": "^2.2.0",
		"typescript": "^4.6.4",
		"vite": "^3.2.3"
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
		"react": "^18.2.0",
		"react-dom": "^18.2.0"
	},
	"devDependencies": {
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@vitejs/plugin-react": "^2.2.0",
		"typescript": "^4.6.4",
		"vite": "^3.2.3"
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
		"react": "^18.2.0",
		"react-dom": "^18.2.0"
	},
	"devDependencies": {
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@vitejs/plugin-react": "^2.2.0",
		"typescript": "^4.6.4",
		"vite": "^3.2.3",
		"vitest": "^0.25.2"
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
		"@elastic/datemath": "^5.0.3",
		"@elastic/eui": "^70.2.0",
		"@emotion/css": "^11.10.5",
		"@emotion/react": "^11.10.5",
		"moment": "^2.29.4",
		"prop-types": "^15.8.1",
		"react": "^18.2.0",
		"react-dom": "^18.2.0"
	},
	"devDependencies": {
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@vitejs/plugin-react": "^2.2.0",
		"typescript": "^4.6.4",
		"vite": "^3.2.3"
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
		"@fluentui/react-icons": "^2.0.187",
		"react": "^18.2.0",
		"react-dom": "^18.2.0"
	},
	"devDependencies": {
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@vitejs/plugin-react": "^2.2.0",
		"typescript": "^4.6.4",
		"vite": "^3.2.3"
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
		"react": "^18.2.0",
		"react-dom": "^18.2.0"
	},
	"devDependencies": {
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@vitejs/plugin-react": "^2.2.0",
		"prettier": "^2.7.1",
		"typescript": "^4.6.4",
		"vite": "^3.2.3"
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
		"react": "^18.2.0",
		"react-dom": "^18.2.0"
	},
	"devDependencies": {
		"@trivago/prettier-plugin-sort-imports": "^3.4.0",
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@vitejs/plugin-react": "^2.2.0",
		"prettier": "^2.7.1",
		"typescript": "^4.6.4",
		"vite": "^3.2.3"
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
		"react": "^18.2.0",
		"react-dom": "^18.2.0"
	},
	"devDependencies": {
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@typescript-eslint/eslint-plugin": "^5.43.0",
		"@typescript-eslint/parser": "^5.43.0",
		"@vitejs/plugin-react": "^2.2.0",
		"eslint": "^8.27.0",
		"eslint-config-react-app": "^7.0.1",
		"eslint-plugin-flowtype": "^8.0.3",
		"eslint-plugin-import": "^2.26.0",
		"eslint-plugin-jsx-a11y": "^6.6.1",
		"eslint-plugin-react": "^7.31.10",
		"eslint-plugin-react-hooks": "^4.6.0",
		"typescript": "^4.6.4",
		"vite": "^3.2.3"
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
		"react": "^18.2.0",
		"react-dom": "^18.2.0"
	},
	"devDependencies": {
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@typescript-eslint/eslint-plugin": "^5.43.0",
		"@typescript-eslint/parser": "^5.43.0",
		"@vitejs/plugin-react": "^2.2.0",
		"eslint": "^8.27.0",
		"eslint-config-prettier": "^8.5.0",
		"eslint-config-react-app": "^7.0.1",
		"eslint-plugin-flowtype": "^8.0.3",
		"eslint-plugin-import": "^2.26.0",
		"eslint-plugin-jsx-a11y": "^6.6.1",
		"eslint-plugin-prettier": "^4.2.1",
		"eslint-plugin-react": "^7.31.10",
		"eslint-plugin-react-hooks": "^4.6.0",
		"prettier": "^2.7.1",
		"typescript": "^4.6.4",
		"vite": "^3.2.3"
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
		"ajv": "^8.11.2",
		"react": "^18.2.0",
		"react-dom": "^18.2.0"
	},
	"devDependencies": {
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@vitejs/plugin-react": "^2.2.0",
		"typescript": "^4.6.4",
		"vite": "^3.2.3"
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
		"lodash-es": "^4.17.21",
		"react": "^18.2.0",
		"react-dom": "^18.2.0"
	},
	"devDependencies": {
		"@types/lodash-es": "^4.17.6",
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@vitejs/plugin-react": "^2.2.0",
		"typescript": "^4.6.4",
		"vite": "^3.2.3"
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
		"mobx": "^6.7.0",
		"mobx-react-lite": "^3.4.0",
		"react": "^18.2.0",
		"react-dom": "^18.2.0"
	},
	"devDependencies": {
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@vitejs/plugin-react": "^2.2.0",
		"typescript": "^4.6.4",
		"vite": "^3.2.3"
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
		"qs": "^6.11.0",
		"react": "^18.2.0",
		"react-dom": "^18.2.0"
	},
	"devDependencies": {
		"@types/qs": "^6.9.7",
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@vitejs/plugin-react": "^2.2.0",
		"typescript": "^4.6.4",
		"vite": "^3.2.3"
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
		"react": "^18.2.0",
		"react-dom": "^18.2.0",
		"react-router-dom": "^6.4.3"
	},
	"devDependencies": {
		"@types/react": "^18.0.24",
		"@types/react-dom": "^18.0.8",
		"@vitejs/plugin-react": "^2.2.0",
		"typescript": "^4.6.4",
		"vite": "^3.2.3"
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
import { resolve } from 'path';
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

	test('generateSrcMainTsx', () => {
		const actual = defaultProject.generateSrcMainTsx();
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
	});

	test('generateSrcMainTsx configurePathAliases', () => {
		const project = new TypeScriptViteReactProject(undefined, {
			configurePathAliases: true,
		});
		const actual = project.generateSrcMainTsx();
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
	});

	test('generateSrcViteEnvDTS', () => {
		const actual = defaultProject.generateSrcViteEnvDTS();
		const expected = `/// <reference types="vite/client" />
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
			'.gitignore',
			'package.json',
			'tsconfig.json',
			'tsconfig.node.json',
			'.eslintrc.cjs',
			'index.html',
			'vite.config.ts',
			'src/App.tsx',
			'src/main.tsx',
			'src/vite-env.d.ts',
		];
		expect(actual).toEqual(expected);
	});
});
