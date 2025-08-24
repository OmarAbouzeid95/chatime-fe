'use server';

export const createRoom = async (_: unknown, body: FormData) => {
	const name = body.get('name');
	console.log('name: ', name);
	await new Promise((resolve) => {
		setTimeout(resolve, 2000);
	});
	return {
		error: 'Something went wrong, please try again.',
	};
};

export const joinRoom = async (_: unknown, body: FormData) => {
	const roomId = body.get('roomId');
	console.log('roomId: ', roomId);
	await new Promise((resolve) => {
		setTimeout(resolve, 2000);
	});
	return {
		error: 'This room is currently full.',
	};
};
