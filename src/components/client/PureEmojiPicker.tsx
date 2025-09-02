'use client';

import { memo, SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import { Theme, EmojiStyle } from 'emoji-picker-react';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const PureEmojiPicker = memo(
	({ setText }: { setText: React.Dispatch<SetStateAction<string>> }) => {
		return (
			<Picker
				className='z-50 !w-[90%] !max-w-md !border !border-input !bg-input/30 !text-sm !absolute !bottom-[70px] !right-4'
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
