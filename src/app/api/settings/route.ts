import { NextResponse } from 'next/server'
import { db } from '@/lib'
import { getCurrentUser } from '@/actions'

export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser()
		const body = await request.json()
		const { name, image } = body

		if (!currentUser?.id) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		const updatedUser = await db.user.update({
			where: {
				id: currentUser.id
			},
			data: {
				image: image,
				name: name
			}
		})

		return NextResponse.json(updatedUser)
	} catch (error) {
		return new NextResponse('Internal Error', { status: 500 })
	}
}
