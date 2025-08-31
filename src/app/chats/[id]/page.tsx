'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/utils/socket';
import { useRouter, useParams } from 'next/navigation';
import Message from '@/components/client/Message';

export default function Home() {
	const router = useRouter();
	const { id: roomId } = useParams<{ id: string }>();
	const [user, setUser] = useState<{ id: number; name: string } | undefined>(
		undefined
	);
	const [messages, setMessages] = useState<any[]>([]);

	useEffect(() => {
		const { id: userId, name } = JSON.parse(localStorage.getItem('user') || '');
		if (!userId || !name || !roomId) {
			router.replace('/');
		}

		setUser({ id: userId, name });

		async function joinRoom() {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/join/${roomId}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId,
					}),
				}
			);
			if (!res.ok) {
				router.replace('/');
			}
		}

		async function getMessages() {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/${roomId}?userId=${userId}`
			);
			const data = await res.json();
			setMessages((prev) => [...prev, ...data]);
		}

		joinRoom().then(getMessages);

		socket.emit('join', roomId);

		socket.on('NEW_MESSAGE', (message) => {
			setMessages((prev) => [...prev, message]);
		});
	}, []);

	return (
		<div>
			<p>User: {user?.name}</p>
			<p>ID: {user?.id}</p>
			<div className='p-4 flex flex-col'>
				{messages.map((message) => (
					<Message
						key={message.uuid}
						content={message.content}
						primary={message.user.id === user?.id}
					/>
				))}
			</div>
		</div>
	);
}
