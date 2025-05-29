"use client";

import ReactEmojiPicker from "emoji-picker-react";
import { Theme, EmojiStyle } from "emoji-picker-react";

type Props = {
  onSelectEmoji: (data: {
    iconUrl: string;
    icon: string;
    name: string;
  }) => void;
};

export default function EmojiPicker({ onSelectEmoji }: Props) {
  return (
    <ReactEmojiPicker
      lazyLoadEmojis
      theme={Theme.DARK}
      emojiStyle={EmojiStyle.APPLE}
      onEmojiClick={d => {
        onSelectEmoji({
          iconUrl: d.imageUrl,
          icon: d.emoji,
          name: d.names[0] || "",
        });
      }}
      previewConfig={{ showPreview: false }}
      className="!bg-neutral-800 !w-[390px] md:!h-[330px] !rounded-md !border-none"
    />
  );
}
