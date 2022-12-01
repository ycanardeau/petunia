import NodeIcon from '@/ui/favicons/nodejs.org.ico';
import ReactIcon from '@/ui/favicons/reactjs.org.ico';
import TypeScriptIcon from '@/ui/favicons/www.typescriptlang.org.png';
import { EuiIcon, EuiSideNav, slugify } from '@elastic/eui';
import React from 'react';

export const AppSideNav = (): React.ReactElement => {
	const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] =
		React.useState(false);

	const toggleOpenOnMobile = (): void =>
		setIsSideNavOpenOnMobile(!isSideNavOpenOnMobile);

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
							href: '/typescript/react',
							// TODO: onClick
							isSelected: true /* TODO */,
						},
						{
							id: slugify('Node.js'),
							name: 'Node.js',
							icon: <EuiIcon type={NodeIcon} />,
							href: '/typescript/node',
							// TODO: onClick
							isSelected: false /* TODO */,
						},
					],
				},
			]}
		/>
	);
};
