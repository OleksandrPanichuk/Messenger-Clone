'use client'

import axios from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { User } from '@prisma/client'

import Image from 'next/image'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Modal from '@/components/modals/Modal'
import Input from '@/components/ui/Input'
import { UploadButton } from '@/components/uploadthing'
import { useMutation } from '@tanstack/react-query'

interface SettingsModalProps {
	isOpen?: boolean
	onClose: () => void
	currentUser: User
}

const SettingsModal: React.FC<SettingsModalProps> = ({
	isOpen,
	onClose,
	currentUser
}) => {
	const router = useRouter()

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		getValues,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			name: currentUser?.name,
			image: currentUser?.image
		}
	})

	const image = watch('image')

	const {mutate: updateUser, isLoading} = useMutation({
		mutationFn: async (data: FieldValues) => {
			return await axios.post('/api/settings', data)
		},
		onSuccess: () => {
			router.refresh(),
			onClose()
		},
		onError: () => {
			toast.error('Something went wrong!')
		}
	})

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		updateUser(data)
	}

	const onModalClose = async () => {
		setValue('image', currentUser?.image, {
			shouldValidate: true
		})
		onClose()
	}

	return (
		<Modal isOpen={isOpen} onClose={onModalClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="space-y-12">
					<div className="border-b border-gray-900/10 pb-12">
						<h2
							className="
                text-base
                font-semibold
                leading-7
                text-gray-900
              "
						>
							Profile
						</h2>
						<p className="mt-1 text-sm leading-6 text-gray-600">
							Edit your public information.
						</p>

						<div className="mt-10 flex flex-col gap-y-8">
							<Input
								disabled={isLoading}
								label="Name"
								id="name"
								errors={errors}
								required
								register={register}
							/>
							<div>
								<label
									htmlFor="photo"
									className="
                    block
                    text-sm
                    font-medium
                    leading-6
                    text-gray-900
                  "
								>
									Photo
								</label>
								<div className="mt-2 flex items-center gap-x-3">
									<Image
										width="48"
										height="48"
										className="rounded-full"
										src={
											image?.url ??
											currentUser?.image ??
											'/placeholder.jpg'
										}
										alt="Avatar"
									/>

									<div className='relative'>
										<Button type='button' disabled={isLoading} secondary>Change</Button>
										<UploadButton
											endpoint={'imageUploader'}
											className='absolute w-full h-full let-0 top-0 opacity-0 z-20 upload-button'
											onClientUploadComplete={async (res) => {
												if (res) {
													setValue('image', res[0].url, {
														shouldValidate: true
													})
												}
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div
					className="
            mt-6
            flex
            items-center
            justify-end
            gap-x-6
          "
				>
					<Button disabled={isLoading} secondary onClick={onModalClose}>
						Cancel
					</Button>
					<Button disabled={isLoading} type="submit">
						Save
					</Button>
				</div>
			</form>
		</Modal>
	)
}

export default SettingsModal
