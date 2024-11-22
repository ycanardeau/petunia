import CSharpIcon from '@/features/csharp/favicons/image.png';
import FableIcon from '@/features/fsharp/favicons/fable.io.ico';
import FSharpIcon from '@/features/fsharp/favicons/fsharp.org.ico';
import HydrangeaIcon from '@/features/typescript/favicons/hydrangea.png';
import NestIcon from '@/features/typescript/favicons/nestjs.com.png';
import NodeIcon from '@/features/typescript/favicons/nodejs.org.ico';
import ReactIcon from '@/features/typescript/favicons/reactjs.org.ico';
import TypeScriptIcon from '@/features/typescript/favicons/www.typescriptlang.org.png';
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
						createItem('Yohira', {
							icon: <EuiIcon type={HydrangeaIcon} />,
							href: '/projects/typescript-yohira',
						}),
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
				{
					id: slugify('CSharp'),
					name: 'C#',
					icon: <EuiIcon type={CSharpIcon} />,
					items: [
						createItem('Clean Architecture', {
							href: '/projects/csharp-clean-architecture',
						}),
					],
				},
				{
					id: slugify('F#'),
					name: 'F#',
					icon: <EuiIcon type={FSharpIcon} />,
					items: [
						createItem('Fable', {
							icon: <EuiIcon type={FableIcon} />,
							href: '/projects/fsharp-fable',
						}),
					],
				},
			]}
		/>
	);
};
