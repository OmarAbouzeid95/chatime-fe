'use client';

import clsx from 'clsx';

type MessageProps = {
	content: string;
	primary?: boolean;
};

export default function Message({ content, primary = false }: MessageProps) {
	return (
		<div
			className={clsx(
				'w-fit max-w-sm p-2 text-foreground font-semibold text-sm rounded-xl mb-1',
				primary ? 'bg-primary' : 'bg-secondary',
				primary ? 'rounded-ee-none' : 'rounded-es-none',
				primary && 'self-end'
			)}
		>
			{content}
		</div>
	);
}
