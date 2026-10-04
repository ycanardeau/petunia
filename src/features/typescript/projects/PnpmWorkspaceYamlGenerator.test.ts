import { dependencies } from '@/features/common/projects/dependencies';
import { PnpmWorkspaceYamlGenerator } from '@/features/typescript/projects/PnpmWorkspaceYamlGenerator';
import { expect, test } from 'vitest';

test('generate', () => {
	const generator = new PnpmWorkspaceYamlGenerator(undefined, {
		packageJson: JSON.stringify({
			dependencies: {
				react: 'catalog:',
				yohira: 'latest',
			},
			devDependencies: {
				'@types/react': 'catalog:',
				'eslint-import-resolver-typescript': 'catalog:',
				vite: 'catalog:',
			},
			peerDependencies: {
				react: 'catalog:',
			},
		}),
	});
	const actual = generator.generate();
	const expected = `allowBuilds:
  unrs-resolver: true

catalog:
  '@types/react': ${dependencies['@types/react']}
  eslint-import-resolver-typescript: ${dependencies['eslint-import-resolver-typescript']}
  react: ${dependencies['react']}
  vite: ${dependencies['vite']}
`;
	expect(actual).toBe(expected);
});
