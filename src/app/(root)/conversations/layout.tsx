import { getConversations, getUsers } from '@/actions'
import ConversationList from '@/components/screens/conversations/ConversationList'
import Sidebar from '@/components/sidebar/Sidebar'

export default async function ConversationsLayout({
	children
}: {
	children: React.ReactNode
}) {
	const conversations = await getConversations()
	const users = await getUsers()

	return (
		<Sidebar>
			<div className="h-full">
				<ConversationList
					users={users}
					title="Messages"
					initialItems={conversations}
				/>
				{children}
			</div>
		</Sidebar>
	)
}
