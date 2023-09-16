'use server'
import { utapi } from 'uploadthing/server'

export const deleteFile = async (key: string) => {
	try {
		return await utapi.deleteFiles([key])
	} catch (err) {
		return null
	}
}
