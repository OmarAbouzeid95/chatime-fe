'use server';

export const sendMessage = async ({
	userId,
	roomId,
	message,
}: {
	userId: number;
	roomId: string;
	message: string;
}) => {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/send/${roomId}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ userId, message: { content: message } }),
			}
		);
		const data = await res.json();
		if (!res.ok) {
			return {
				error: data.message,
			};
		}
		return data;
	} catch (error) {
		console.error(`Error while sending message: `, error);
		return {
			error: 'Something went wrong, please try again.',
		};
	}
};
