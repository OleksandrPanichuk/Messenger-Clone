'use server'

import { getCurrentUser } from '@/actions/getCurrentUser'
import { db } from '@/lib'

export const getConversations = async () => {
	const currentUser = await getCurrentUser()

	if (!currentUser?.id) {
		return []
	}

	try {
		const conversations = await db.conversation.findMany({
			orderBy: {
				lastMessageAt: 'desc'
			},
			where: {
				userIds: {
					has: currentUser.id
				}
			},
			include: {
				users: true,
				messages: {
					include: {
						sender: true,
						seen: true
					}
				}
			}
		})

		return conversations
	} catch (error: any) {
		return []
	}
}
