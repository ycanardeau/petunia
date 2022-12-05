import NestIcon from '@/ui/favicons/nestjs.com.png';
import NodeIcon from '@/ui/favicons/nodejs.org.ico';
import ReactIcon from '@/ui/favicons/reactjs.org.ico';
import TypeScriptIcon from '@/ui/favicons/www.typescriptlang.org.png';
import { EuiIcon, EuiSideNav, EuiSideNavItemType, slugify } from '@elastic/eui';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const AppSideNav = (): React.ReactElement => {
	const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] =
		React.useState(false);

	const toggleOpenOnMobile = (): void =>
		setIsSideNavOpenOnMobile(!isSideNavOpenOnMobile);

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const createItem = React.useCallback(
		(
			name: string,
			data: Omit<EuiSideNavItemType<unknown>, 'id' | 'name'>,
		) => {
			const item: EuiSideNavItemType<unknown> = {
				id: slugify(name),
				name: name,
				icon: data.icon,
				href: `/#${data.href}`,
				onClick: (e): void => {
					e.preventDefault();
					navigate(data.href ?? '');
				},
				isSelected: pathname === data.href,
			};
			return item;
		},
		[navigate, pathname],
	);

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
						createItem('React', {
							icon: <EuiIcon type={ReactIcon} />,
							href: '/projects/typescript-vite-react',
						}),
						createItem('Node.js', {
							icon: <EuiIcon type={NodeIcon} />,
							href: '/projects/typescript-node-console',
						}),
						createItem('NestJS', {
							icon: <EuiIcon type={NestIcon} />,
							href: '/projects/typescript-nest',
						}),
					],
				},
			]}
		/>
	);
};
