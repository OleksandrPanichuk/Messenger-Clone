'use server'
import { utapi } from 'uploadthing/server'
import { Image } from '@prisma/client'

export const uploadFile = async (file: File): Promise<Image | null> => {
	try {
		const res = await utapi.uploadFiles([file])
		const uploadedFile = res[0]

		return {
			url: uploadedFile.data?.url!,
			key: uploadedFile.data?.key!
		}
	} catch {
		return null
	}
}
