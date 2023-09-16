'use client'

import { useConversation } from '@/hooks'
import EmptyState from '@/components/EmptyState'
import { cn } from '@/lib'

const Home = () => {
	const { isOpen } = useConversation()

	return (
		<div
			className={cn('lg:pl-80 h-full lg:block', isOpen ? 'block' : 'hidden')}
		>
			<EmptyState />
		</div>
	)
}

export default Home
