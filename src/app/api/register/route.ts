import bcrypt from 'bcrypt'

import { db } from '@/lib'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { email, name, password } = body

		if (!email || !name || !password)
			return new NextResponse('Missing Info', { status: 400 })

		const existingUser = await db.user.findUnique({
			where: {
				email
			}
		})

		if (existingUser)
			return new NextResponse('User already exist', { status: 409 })

		const hashedPassword = await bcrypt.hash(password, 12)

		const user = await db.user.create({
			data: {
				email,
				name,
				hashedPassword
			}
		})

		return NextResponse.json(user)
	} catch (err) {
		return new NextResponse('Internal Error', { status: 500 })
	}
}
