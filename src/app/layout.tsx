import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Provider from '@/components/Provider'
import ActiveStatus from '@/components/ActiveStatus'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Messenger Clone',
	description: 'Messenger Clone'
}

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Provider>
					<ActiveStatus />
					{children}
					</Provider>
			</body>
		</html>
	)
}
