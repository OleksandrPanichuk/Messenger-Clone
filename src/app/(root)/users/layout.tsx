import { ReactNode } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import { getUsers } from '@/actions'
import UserList from '@/components/screens/users/UserList'

export default async function UsersLayout({
	children
}: {
	children: ReactNode
}) {
	const users = await getUsers()
	return (
		<Sidebar>
			<div className={'h-full'}>
				<UserList items={users} />
				{children}
			</div>
		</Sidebar>
	)
}
