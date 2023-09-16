import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { getCurrentUser } from '@/actions'

const f = createUploadthing()

export const ourFileRouter = {
	imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(async (req) => {
			const user = await getCurrentUser()

			if (!user) throw new Error('Unauthorized')

			return { userId: user.id }
		})
		.onUploadComplete(async ({ metadata, file }) => {})
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
