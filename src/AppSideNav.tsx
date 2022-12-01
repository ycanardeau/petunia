import NodeIcon from '@/ui/favicons/nodejs.org.ico';
import ReactIcon from '@/ui/favicons/reactjs.org.ico';
import TypeScriptIcon from '@/ui/favicons/www.typescriptlang.org.png';
import { EuiIcon, EuiSideNav, slugify } from '@elastic/eui';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const AppSideNav = (): React.ReactElement => {
	const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] =
		React.useState(false);

	const toggleOpenOnMobile = (): void =>
		setIsSideNavOpenOnMobile(!isSideNavOpenOnMobile);

	const navigate = useNavigate();
	const { pathname } = useLocation();

	return (
		<EuiSideNav
			heading="Navigation" /* LOC */
			toggleOpenOnMobile={toggleOpenOnMobile}
			isOpenOnMobile={isSideNavOpenOnMobile}
			items={[
				{
					id: slugify('TypeScript'),
					name: 'TypeScript',
					icon: <EuiIcon type={TypeScriptIcon} />,
					items: [
						{
							id: slugify('React'),
							name: 'React',
							icon: <EuiIcon type={ReactIcon} />,
							href: '/#/projects/typescript-vite-react',
							onClick: (e): void => {
								e.preventDefault();
								navigate('/projects/typescript-vite-react');
							},
							isSelected:
								pathname === '/projects/typescript-vite-react',
						},
						{
							id: slugify('Node.js'),
							name: 'Node.js',
							icon: <EuiIcon type={NodeIcon} />,
							href: '/#/projects/typescript-node-console',
							onClick: (e): void => {
								e.preventDefault();
								navigate('/projects/typescript-node-console');
							},
							isSelected:
								pathname ===
								'/projects/typescript-node-console',
						},
					],
				},
			]}
		/>
	);
};
