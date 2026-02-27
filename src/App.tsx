import { AppRoutes } from '@/AppRoutes';
import { AppSideNav } from '@/AppSideNav';
import { Header } from '@/features/header/components/Header';
import { EuiPageTemplate, EuiProvider, EuiSpacer, EuiText } from '@elastic/eui';
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
				<Header />
				<EuiPageTemplate panelled restrictWidth>
					<EuiPageTemplate.Sidebar sticky>
						<AppSideNav />
					</EuiPageTemplate.Sidebar>
					<EuiPageTemplate.Section>
						<React.Suspense fallback={null}>
							<AppRoutes />
						</React.Suspense>

						<EuiSpacer size="xl" />
						<div>
							<EuiText
								size="xs"
								textAlign="center"
								color="subdued"
							>
								<p>
									<a
										href="https://www.flaticon.com/free-icons/flower"
										title="flower icons"
										target="_blank"
										rel="noreferrer"
									>
										Flower icons created by Freepik -
										Flaticon
									</a>
								</p>
							</EuiText>
						</div>
					</EuiPageTemplate.Section>
				</EuiPageTemplate>
			</EuiProvider>
		</HashRouter>
	);
};

export default App;
