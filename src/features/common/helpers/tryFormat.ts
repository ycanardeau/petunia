import { ProjectFile } from '@/features/common/projects/Project';
import prettierPluginBabel from 'prettier/plugins/babel';
import prettierPluginEstree from 'prettier/plugins/estree';
import prettierPluginHtml from 'prettier/plugins/html';
import prettierPluginTypescript from 'prettier/plugins/typescript';
import prettier from 'prettier/standalone';

export async function tryFormat({ path, text }: ProjectFile): Promise<string> {
	try {
		return await prettier.format(text, {
			filepath: path,
			plugins: [
				prettierPluginBabel,
				prettierPluginEstree,
				prettierPluginHtml,
				prettierPluginTypescript,
			],
			singleQuote: true,
			trailingComma: 'all',
			endOfLine: 'lf',
			useTabs: true,
		});
	} catch (error) {
		console.error(error);
		return Promise.resolve(text);
	}
}
