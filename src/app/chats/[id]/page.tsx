'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/utils/socket';
import { useRouter, useParams } from 'next/navigation';
import Message from '@/components/client/Message';
import { Textarea } from '@/components/ui/textarea';
import { sendMessage } from '@/utils/actions/messages';

export default function Home() {
	const router = useRouter();
	const { id: roomId } = useParams<{ id: string }>();
	const [user, setUser] = useState<{ id: number; name: string } | undefined>(
		undefined
	);
	const [text, setText] = useState('');
	const [messages, setMessages] = useState<any[]>([]);

	const onFormSubmit = () => {
		sendMessage({ userId: user?.id as number, roomId, message: text })
			.then((data: any) => {
				if (data.error) {
					throw new Error();
				}
				setMessages((prev) => [...prev, data]);
			})
			.catch((error) => {
				console.log('something went wrong');
			});
	};

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
			if (message.user.id !== userId) {
				setMessages((prev) => [...prev, message]);
			}
		});
	}, []);

	return (
		<div>
			<p>User: {user?.name}</p>
			<p>ID: {user?.id}</p>
			<div className='px-4 flex flex-col-reverse mb-20'>
				{messages.map((message) => (
					<Message
						key={message.uuid}
						content={message.content}
						primary={message.user.id === user?.id}
					/>
				))}
			</div>
			<form className='fixed w-full bottom-0 left-0 right-0 px-4 py-4 shadow- backdrop-blur-sm'>
				<Textarea
					className='relative block w-full'
					placeholder='Message'
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={(e) => {
						if (e.repeat) return;
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							onFormSubmit();
							setText('');
						}
					}}
				/>
			</form>
		</div>
	);
}
