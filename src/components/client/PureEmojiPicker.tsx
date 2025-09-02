'use client';

import { memo, SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import { Theme, EmojiStyle } from 'emoji-picker-react';
import clsx from 'clsx';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const PureEmojiPicker = memo(
	({
		setText,
		showEmoji,
	}: {
		setText: React.Dispatch<SetStateAction<string>>;
		showEmoji: boolean;
	}) => {
		return (
			<Picker
				className={clsx(
					'z-50 !w-[90%] !max-w-md !border !border-input !bg-background !text-sm !absolute !bottom-[70px] !right-4 transition-all ease-in-out',
					showEmoji ? 'opacity-100' : 'opacity-0'
				)}
				style={{ font: 'inherit' }}
				theme={Theme.DARK}
				lazyLoadEmojis={true}
				emojiStyle={EmojiStyle.NATIVE}
				onEmojiClick={(emoji) =>
					setText((prev: string) => `${prev}${emoji.emoji}`)
				}
			/>
		);
	}
);

export default PureEmojiPicker;
