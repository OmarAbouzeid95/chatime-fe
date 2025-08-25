'use server';

export const createRoom = async (_: unknown, body: FormData) => {
	try {
		const name = body.get('name');
		const res = await fetch(`${process.env.BACKEND_URL}/rooms/create`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ name }),
		});
		const data = await res.json();
		if (!res.ok) {
			return {
				error: data.message,
			};
		}
		return {
			data,
		};
	} catch (error) {
		console.error(`Error while creating room: `, error);
		return {
			error: 'Something went wrong, please try again.',
		};
	}
};

export const joinRoom = async (_: unknown, body: FormData) => {
	try {
		const name = body.get('name');
		const roomId = body.get('roomId');
		const res = await fetch(`${process.env.BACKEND_URL}/rooms/join`, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ name, roomId }),
		});
		const data = await res.json();
		if (!res.ok) {
			return {
				error: data.message,
			};
		}
		return {
			data,
		};
	} catch (error) {
		console.error(`Error while creating room: `, error);
		return {
			error: 'Something went wrong, please try again.',
		};
	}
};
