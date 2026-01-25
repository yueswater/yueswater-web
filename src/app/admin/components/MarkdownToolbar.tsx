"use client";

import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Code,
  Sigma,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { ToolbarButton } from "./ToolbarButton";

// Markdown 工具列組件
interface MarkdownToolbarProps {
  onInsert: (prefix: string, suffix?: string) => void;
  onImageClick?: () => void;
}

// Markdown 工具列組件
export function MarkdownToolbar({ onInsert, onImageClick }: MarkdownToolbarProps) {
  return (
    <div className="bg-card/50 flex shrink-0 items-center gap-1 overflow-x-auto border-b border-[color:var(--border)] p-2">
      <ToolbarButton
        onClick={() => onInsert("**", "**")}
        icon={<Bold className="h-4 w-4" />}
        tooltip="粗體"
      />
      <ToolbarButton
        onClick={() => onInsert("*", "*")}
        icon={<Italic className="h-4 w-4" />}
        tooltip="斜體"
      />

      <div className="mx-1 h-4 w-px bg-[(--border)]" />

      <ToolbarButton
        onClick={() => onInsert("# ")}
        icon={<Heading1 className="h-4 w-4" />}
        tooltip="大標題"
      />
      <ToolbarButton
        onClick={() => onInsert("## ")}
        icon={<Heading2 className="h-4 w-4" />}
        tooltip="中標題"
      />
      <ToolbarButton
        onClick={() => onInsert("### ")}
        icon={<Heading3 className="h-4 w-4" />}
        tooltip="小標題"
      />
      <ToolbarButton
        onClick={() => onInsert("> ")}
        icon={<Quote className="h-4 w-4" />}
        tooltip="引用"
      />
      <ToolbarButton
        onClick={() => onInsert("- ")}
        icon={<List className="h-4 w-4" />}
        tooltip="無序清單"
      />
      <ToolbarButton
        onClick={() => onInsert("1. ")}
        icon={<ListOrdered className="h-4 w-4" />}
        tooltip="有序清單"
      />

      <div className="mx-1 h-4 w-px bg-[(--border)]" />

      <ToolbarButton
        onClick={() => onInsert("```\n", "\n```")}
        icon={<Code className="h-4 w-4" />}
        tooltip="程式碼區塊"
      />
      <ToolbarButton
        onClick={() => onInsert("$", "$")}
        icon={<Sigma className="h-4 w-4" />}
        tooltip="數學公式"
      />

      <div className="mx-1 h-4 w-px bg-[(--border)]" />

      <ToolbarButton
        onClick={() => (onImageClick ? onImageClick() : onInsert("![圖片描述](url)"))}
        icon={<ImageIcon className="h-4 w-4" />}
        tooltip="插入圖片"
      />
      <ToolbarButton
        onClick={() => onInsert("[連結文字](url)")}
        icon={<LinkIcon className="h-4 w-4" />}
        tooltip="連結"
      />
    </div>
  );
}
