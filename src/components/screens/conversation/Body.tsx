'use client'

import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

import find from 'lodash.find'
import { FullMessageType } from '@/types'
import { useConversation } from '@/hooks'
import { pusherClient } from '@/lib'
import MessageBox from '@/components/screens/conversation/MessageBox'

interface BodyProps {
	initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {
	const bottomRef = useRef<HTMLDivElement>(null)
	const [messages, setMessages] = useState(initialMessages)

	const { conversationId } = useConversation()

	useEffect(() => {
		axios.post(`/api/conversations/${conversationId}/seen`)
	}, [conversationId])

	useEffect(() => {
		pusherClient.subscribe(conversationId as string)
		bottomRef?.current?.scrollIntoView()

		const messageHandler = (message: FullMessageType) => {
			axios.post(`/api/conversations/${conversationId}/seen`)

			setMessages((current) => {
				if (find(current, { id: message.id })) {
					return current
				}

				return [...current, message]
			})

			bottomRef?.current?.scrollIntoView()
		}

		const updateMessageHandler = (newMessage: FullMessageType) => {
			setMessages((current) =>
				current.map((currentMessage) => {
					if (currentMessage.id === newMessage.id) {
						return newMessage
					}

					return currentMessage
				})
			)
		}

		pusherClient.bind('messages:new', messageHandler)
		pusherClient.bind('message:update', updateMessageHandler)

		return () => {
			pusherClient.unsubscribe(conversationId as string)
			pusherClient.unbind('messages:new', messageHandler)
			pusherClient.unbind('message:update', updateMessageHandler)
		}
	}, [conversationId])

	return (
		<div className="flex-1 overflow-y-auto">
			{messages.map((message, i) => (
				<MessageBox
					isLast={i === messages.length - 1}
					key={message.id}
					data={message}
				/>
			))}
			<div className="pt-24" ref={bottomRef} />
		</div>
	)
}

export default Body
