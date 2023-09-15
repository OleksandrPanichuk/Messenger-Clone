import { db } from '@/lib'
import { getSession } from './getSession'

export const getUsers = async () => {
	const session = await getSession()

	if (!session?.user?.email) {
		return []
	}

	try {
		const users = await db.user.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			where: {
				NOT: {
					email: session.user.email
				}
			}
		})

		return users
	} catch (error: any) {
		return []
	}
}
