'use client'

import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2'
import MessageInput from './MessageInput'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import axios from 'axios'
import { useConversation } from '@/hooks'
import { UploadButton } from '@/components/uploadthing'

const Form = () => {
	const { conversationId } = useConversation()

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			message: ''
		}
	})

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		setValue('message', '', { shouldValidate: true })
		axios.post('/api/messages', {
			...data,
			conversationId: conversationId
		})
	}

	return (
		<div
			className="
        py-4
        px-4
        bg-white
        border-t
        flex
        items-center
        gap-2
        lg:gap-4
        w-full
      "
		>
			<div className='relative cursor-pointer'>
				<HiPhoto size={30} className="text-sky-500 relative z-10"  />
				<UploadButton
					className='absolute w-full h-full let-0 top-0 opacity-0 z-20 upload-button'
					endpoint={'imageUploader'}
					onClientUploadComplete={(res) => {
						axios.post('/api/messages', {
							image: {
								url: res?.[0].url!,
								key: res?.[0].key!
							},
							conversationId: conversationId
						})
					}}
				/>
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex items-center gap-2 lg:gap-4 w-full"
			>
				<MessageInput
					id="message"
					register={register}
					errors={errors}
					required
					placeholder="Write a message"
				/>
				<button
					type="submit"
					className="
            rounded-full
            p-2
            bg-sky-500
            cursor-pointer
            hover:bg-sky-600
            transition
          "
				>
					<HiPaperAirplane size={18} className="text-white" />
				</button>
			</form>
		</div>
	)
}

export default Form
