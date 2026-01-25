"use client";

import { forwardRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

// 編輯器輸入組件
interface EditorInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

// 編輯器輸入組件
export const EditorInput = forwardRef<HTMLTextAreaElement, EditorInputProps>(
  ({ value, onChange, placeholder }, ref) => {
    return (
      <TextareaAutosize
        ref={ref}
        placeholder={placeholder}
        className="text-foreground/90 placeholder:text-foreground/30 min-h-[500px] w-full resize-none bg-transparent font-mono text-lg leading-relaxed outline-none"
        minRows={15}
        value={value}
        onChange={onChange}
      />
    );
  }
);

EditorInput.displayName = "EditorInput";
