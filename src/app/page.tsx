import RoomForm from '@/components/server/RoomForm';
import { createRoom, joinRoom } from '@/utils/actions/rooms';
import { Plus, Merge } from 'lucide-react';

const createRoomInput = {
	name: 'name',
	placeholder: 'Enter a name',
	maxLength: 20,
	required: true,
};

const joinRoomInputs = [
	createRoomInput,
	{
		name: 'roomId',
		placeholder: 'Enter room code',
		maxLength: 20,
		required: true,
	},
];

export default function Home() {
	return (
		<div className='h-screen w-screen flex items-center justify-center'>
			<div className='px-4 w-full grid max-w-md md:max-w-3xl grid-cols-1 gap-6 md:grid-cols-2'>
				<RoomForm
					Icon={<Plus />}
					title='Create a private room'
					description={'Lorem ipsum dolor..'}
					inputs={[createRoomInput]}
					formHandler={createRoom}
					ctaText='Create room'
				/>
				<RoomForm
					Icon={<Merge />}
					title='Join a private room'
					description={'Lorem ipsum dolor..'}
					inputs={joinRoomInputs}
					formHandler={joinRoom}
					ctaText='Join room'
				/>
			</div>
		</div>
	);
}
