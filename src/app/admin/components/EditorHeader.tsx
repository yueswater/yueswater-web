"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Save, Send } from "lucide-react";

interface EditorHeaderProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function EditorHeader({
  isEditing,
  isSubmitting,
  onSaveDraft,
  onPublish,
}: EditorHeaderProps) {
  return (
    <header className="bg-card flex h-16 shrink-0 items-center justify-between border-b border-[color:var(--border)] px-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="hover:bg-primary/10 rounded-full p-2 transition-colors">
          <ArrowLeft className="text-foreground/60 h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold">{isEditing ? "編輯文章" : "撰寫新文章"}</h1>
        <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs">
          Markdown + Math
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="text-foreground/80 hover:bg-secondary flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          儲存草稿
        </button>
        <button
          onClick={onPublish}
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          發布文章
        </button>
      </div>
    </header>
  );
}
