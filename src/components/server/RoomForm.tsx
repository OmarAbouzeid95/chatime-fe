'use client';
import { redirect } from 'next/navigation';
import { useActionState, useEffect, HTMLProps, ReactNode } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

type RoomFormProps = {
	Icon: ReactNode;
	title: string;
	description: string;
	inputs: HTMLProps<HTMLInputElement>[];
	formHandler: (_: unknown, body: FormData) => Promise<Record<string, any>>;
	ctaText: string;
};

export default function RoomForm({
	Icon,
	title,
	description,
	inputs,
	formHandler,
	ctaText,
}: RoomFormProps) {
	const [response, formAction, isPending] = useActionState(formHandler, null);

	useEffect(() => {
		if (response?.data) {
			redirect(`/chats/${response.data.room.uuid}`);
		}
	}, [response]);

	return (
		<Card>
			<CardHeader className='space-y-4'>
				<div className='w-fit p-2 bg-input/30 rounded-md shadow-xs'>{Icon}</div>
			</CardHeader>
			<CardContent className='h-full flex flex-col justify-between'>
				<div className='space-y-3 mb-6'>
					<h2 className='text-lg font-semibold'>{title}</h2>
					<p>{description}</p>
				</div>
				<form action={formAction} className='space-y-3'>
					{inputs.map((inputProps) => (
						<Input key={inputProps.name} {...inputProps} />
					))}
					{response?.error && (
						<p className='text-sm text-destructive/85'>{response.error}</p>
					)}
					<Button
						type='submit'
						className='w-full flex items-center gap-2 font-semibold'
						disabled={isPending}
					>
						{isPending && <Loader2 className='animate-spin infinite' />}
						{ctaText}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
