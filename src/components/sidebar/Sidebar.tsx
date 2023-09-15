import React, { FC, ReactNode } from 'react'

import { getCurrentUser } from '@/actions'
import DesktopSidebar from './DesktopSidebar'
import MobileFooter from './MobileFooter'

const Sidebar: FC<{ children: ReactNode }> = async ({ children }) => {
	const currentUser = await getCurrentUser()
	return (
		<div className={'h-full'}>
			<DesktopSidebar currentUser={currentUser!} />
			<MobileFooter />
			<main className={'lg:pl-20 h-full'}>{children}</main>
		</div>
	)
}

export default Sidebar
