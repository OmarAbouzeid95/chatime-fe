'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/utils/socket';
import { useRouter, useParams } from 'next/navigation';
import Message from '@/components/client/Message';
import PureEmojiPicker from '@/components/client/PureEmojiPicker';
import { Textarea } from '@/components/ui/textarea';
import { sendMessage } from '@/utils/actions/messages';
import { SmilePlus } from 'lucide-react';
import clsx from 'clsx';

export default function Home() {
	const router = useRouter();
	const { id: roomId } = useParams<{ id: string }>();
	const [user, setUser] = useState<{ id: number; name: string } | undefined>(
		undefined
	);
	const [text, setText] = useState('');
	const [messages, setMessages] = useState<any[]>([]);
	const [showEmoji, setShowEmoji] = useState(false);

	const onFormSubmit = () => {
		sendMessage({ userId: user?.id as number, roomId, message: text })
			.then((data: any) => {
				if (data.error) {
					throw new Error();
				}
				setMessages((prev) => [data, ...prev]);
			})
			.catch((error) => {
				console.log('something went wrong');
			});
	};

	useEffect(() => {
		window.scrollTo(0, document.body.scrollHeight);
	}, [messages]);

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
				return false;
			}
			return true;
		}

		async function getMessages() {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/${roomId}?userId=${userId}`
			);
			if (!res.ok) {
				return router.replace('/');
			}
			const data = await res.json();
			setMessages(data);
		}

		joinRoom()
			.then((success) => {
				if (!success) {
					throw new Error('Failed to join room');
				}
				getMessages();
			})
			.catch(() => {
				router.replace('/');
			});

		socket.emit('join', roomId);

		socket.on('NEW_MESSAGE', (message) => {
			if (message.user.id !== userId) {
				setMessages((prev) => [message, ...prev]);
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
			<div>
				<div
					className={clsx(
						'fixed inset-0 bg-transparent',
						showEmoji ? 'block' : 'hidden'
					)}
					onClick={() => setShowEmoji(false)}
				></div>
				<PureEmojiPicker setText={setText} showEmoji={showEmoji} />
			</div>
			<form className='fixed w-full flex justify-between gap-2 bottom-0 left-0 right-0 px-4 py-4 backdrop-blur-sm'>
				<Textarea
					className='relative block w-full'
					placeholder='Message'
					value={text}
					onChange={(e) => setText(e.target.value)}
					onFocus={() => setShowEmoji(false)}
					onKeyDown={(e) => {
						if (e.repeat) return;
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							onFormSubmit();
							setText('');
						}
					}}
				/>
				<SmilePlus
					size={24}
					className='w-10 p-2 border border-input shadow-xs bg-input/30 rounded-md h-auto text-muted-foreground cursor-pointer'
					onClick={(e) => {
						e.preventDefault();
						setShowEmoji((prev) => !prev);
					}}
				/>
			</form>
		</div>
	);
}
