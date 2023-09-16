'use server'
import { db } from '@/lib'
import { getCurrentUser } from '@/actions/getCurrentUser'

export const getConversationById = async (conversationId: string) => {
	try {
		const currentUser = await getCurrentUser()

		if (!currentUser?.email) {
			return null
		}

		const conversation = await db.conversation.findUnique({
			where: {
				id: conversationId
			},
			include: {
				users: true
			}
		})

		return conversation
	} catch (error: any) {
		console.log(error, 'SERVER_ERROR')
		return null
	}
}
