'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false
		}
	}
})
const Provider: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				<Toaster />
				{children}
			</QueryClientProvider>
		</SessionProvider>
	)
}

export default Provider
