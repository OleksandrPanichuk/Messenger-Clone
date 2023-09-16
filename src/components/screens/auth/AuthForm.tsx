'use client'

import { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { BsGithub, BsGoogle } from 'react-icons/bs'

import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import AuthSocialButton from '@/components/screens/auth/AuthSocialButton'
import { signIn, SignInResponse } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { User } from '.prisma/client'

type Variant = 'LOGIN' | 'REGISTER'
const AuthForm = () => {
	const router = useRouter()
	const [variant, setVariant] = useState<Variant>('LOGIN')
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const toggleVariant = useCallback(() => {
		if (variant === 'LOGIN') {
			setVariant('REGISTER')
		} else {
			setVariant('LOGIN')
		}
	}, [variant])

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			email: '',
			password: ''
		}
	})

	const { mutateAsync: signUp } = useMutation({
		mutationFn: async (data: FieldValues) => {
			try {
				const { data: userData } = await axios.post('/api/register', data)
				userData.password = data.password
				return userData as User & { password: string }
			} catch (err) {
				throw err
			}
		},
		onSuccess: async (data: User & { password: string }) => {
			return await signIn('credentials', {
				email: data.email,
				password: data.password,
				redirect: false
			}).then(afterSignInAction)
		},
		onError: (error: AxiosError) => {
			if (error.response?.status === 409) {
				return toast.error('User Already Exist')
			}
			return toast.error('Something went wrong')
		}
	})

	const afterSignInAction = (callback: SignInResponse | undefined) => {
		if (callback?.error) {
			return toast.error('Invalid credentials!')
		}

		if (callback?.ok) {
			return router.push('/conversations')
		}
	}
	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setIsLoading(true)
		if (variant === 'REGISTER') {
			try {
				await signUp(data)
			} finally {
				setIsLoading(false)
			}
		}
		if (variant === 'LOGIN') {
			signIn('credentials', {
				...data,
				redirect: false
			})
				.then(afterSignInAction)
				.finally(() => setIsLoading(false))
		}
	}

	const socialAction = (action: string) => {
		setIsLoading(true)

		signIn(action, { redirect: false })
			.then(afterSignInAction)
			.finally(() => setIsLoading(false))
	}

	return (
		<div className={'mt-8 sm:mx-auto sm:w-full sm:max-w-md'}>
			<div className={'bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'}>
				<form onSubmit={handleSubmit(onSubmit)} className={'space-y-6'}>
					{variant === 'REGISTER' && (
						<Input
							disabled={isLoading}
							register={register}
							errors={errors}
							required
							id="name"
							label="Name"
						/>
					)}
					<Input
						disabled={isLoading}
						register={register}
						errors={errors}
						required
						id="email"
						label="Email address"
						type="email"
					/>
					<Input
						disabled={isLoading}
						register={register}
						errors={errors}
						required
						id="password"
						label="Password"
						type="password"
					/>
					<div>
						<Button disabled={isLoading} fullWidth type="submit">
							{variant === 'LOGIN' ? 'Sign in' : 'Register'}
						</Button>
					</div>
				</form>

				<div className="mt-6">
					<div className="relative">
						<div
							className="
                absolute
                inset-0
                flex
                items-center
              "
						>
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-white px-2 text-gray-500">
								Or continue with
							</span>
						</div>
					</div>

					<div className="mt-6 flex gap-2">
						<AuthSocialButton
							icon={BsGithub}
							onClick={() => socialAction('github')}
						/>
						<AuthSocialButton
							icon={BsGoogle}
							onClick={() => socialAction('google')}
						/>
					</div>
				</div>
				<div
					className="
            flex
            gap-2
            justify-center
            text-sm
            mt-6
            px-2
            text-gray-500
          "
				>
					<div>
						{variant === 'LOGIN'
							? 'New to Messenger?'
							: 'Already have an account?'}
					</div>
					<div onClick={toggleVariant} className="underline cursor-pointer">
						{variant === 'LOGIN' ? 'Create an account' : 'Login'}
					</div>
				</div>
			</div>
		</div>
	)
}

export default AuthForm
