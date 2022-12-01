import { AppSideNav } from '@/AppSideNav';
import '@/icons';
import { TypeScriptViteReactProjectCreateModal } from '@/ui/components/TypeScriptViteReactProjectCreateModal';
import { EuiPageTemplate, EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import createCache from '@emotion/cache';
import React from 'react';

// https://elastic.github.io/eui/#/utilities/provider
const euiCache = createCache({
	key: 'eui',
	container: document.querySelector('meta[name="eui-style-insert"]') as Node,
});
euiCache.compat = true;

const App = (): React.ReactElement => {
	return (
		<EuiProvider colorMode="dark" cache={euiCache}>
			<EuiPageTemplate panelled restrictWidth>
				<EuiPageTemplate.Sidebar sticky>
					<AppSideNav />
				</EuiPageTemplate.Sidebar>
				<EuiPageTemplate.Section>
					<TypeScriptViteReactProjectCreateModal />
				</EuiPageTemplate.Section>
			</EuiPageTemplate>
		</EuiProvider>
	);
};

export default App;
