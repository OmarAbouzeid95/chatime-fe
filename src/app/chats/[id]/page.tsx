'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/utils/socket';
import { useRouter, useParams } from 'next/navigation';

export default function Home() {
	const router = useRouter();
	const { id: roomId } = useParams<{ id: string }>();
	const [user, setUser] = useState<{ id: number; name: string } | undefined>(
		undefined
	);

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

		joinRoom();

		socket.emit('join', roomId);

		socket.on('NEW_MESSAGE', (message) => {
			console.log('New message: ', message);
		});
	}, []);

	return (
		<div>
			<p>User: {user?.name}</p>
			<p>ID: {user?.id}</p>
		</div>
	);
}
