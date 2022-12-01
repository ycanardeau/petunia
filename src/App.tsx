import { AppRoutes } from '@/AppRoutes';
import { AppSideNav } from '@/AppSideNav';
import '@/icons';
import { EuiPageTemplate, EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import createCache from '@emotion/cache';
import React from 'react';
import { HashRouter } from 'react-router-dom';

// https://elastic.github.io/eui/#/utilities/provider
const euiCache = createCache({
	key: 'eui',
	container: document.querySelector('meta[name="eui-style-insert"]') as Node,
});
euiCache.compat = true;

const App = (): React.ReactElement => {
	return (
		<HashRouter>
			<EuiProvider colorMode="dark" cache={euiCache}>
				<EuiPageTemplate panelled restrictWidth>
					<EuiPageTemplate.Sidebar sticky>
						<AppSideNav />
					</EuiPageTemplate.Sidebar>
					<EuiPageTemplate.Section>
						<AppRoutes />
					</EuiPageTemplate.Section>
				</EuiPageTemplate>
			</EuiProvider>
		</HashRouter>
	);
};

export default App;
