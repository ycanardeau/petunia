export enum TargetLanguage {
	TypeScriptNode = 'TypeScriptNode',
	TypeScriptBrowser = 'TypeScriptBrowser',
}

export const targetLanguageNames: Record<TargetLanguage, string> = {
	[TargetLanguage.TypeScriptNode]: 'TypeScript (Node.js)',
	[TargetLanguage.TypeScriptBrowser]: 'TypeScript (Browser)',
};
