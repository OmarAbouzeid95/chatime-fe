import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
	return (
		<div className='h-screen w-screen flex items-center justify-center'>
			<div className='px-4 w-full max-w-md space-y-4'>
				<Button asChild className='w-full'>
					<Link href='/chat'>Create a room</Link>
				</Button>
				<Button variant='outline' asChild className='w-full'>
					<Link href='/chat'>Join a room</Link>
				</Button>
			</div>
		</div>
	);
}
