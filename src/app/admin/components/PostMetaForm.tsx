"use client";

import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import { Image as ImageIcon } from "lucide-react";
import { SmartSelector } from "./SmartSelector";
import { Category, Tag } from "@/types";

// 文章元資料表單組件
interface PostMetaFormProps {
  title: string;
  setTitle: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  excerpt: string;
  setExcerpt: (val: string) => void;

  // 封面圖相關
  previewUrl: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // 分類與標籤資料
  availableCategories: Category[];
  availableTags: Tag[];
  selectedCategories: Category[];
  selectedTags: Tag[];

  // 分類與標籤操作
  setSelectedCategories: (items: Category[]) => void;
  setSelectedTags: (items: Tag[]) => void;
  onCreateCategory: (name: string) => void;
  onCreateTag: (name: string) => void;

  isEditing: boolean;
}

// 文章元資料表單組件
export function PostMetaForm({
  title,
  setTitle,
  slug,
  setSlug,
  excerpt,
  setExcerpt,
  previewUrl,
  onImageChange,
  availableCategories,
  availableTags,
  selectedCategories,
  selectedTags,
  setSelectedCategories,
  setSelectedTags,
  onCreateCategory,
  onCreateTag,
  isEditing,
}: PostMetaFormProps) {
  return (
    <div className="mx-auto mb-6 w-full max-w-3xl space-y-6">
      {/* 封面圖片區塊 */}
      <div className="space-y-2">
        <label className="text-foreground/60 my-2 mb-3 pt-3 text-xl font-medium">封面圖片</label>
        <div
          className={`hover:border-primary/50 hover:bg-primary/5 group relative flex aspect-21/9 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[color:var(--border)] transition-all ${previewUrl ? "border-solid border-transparent" : ""}`}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
            onChange={onImageChange}
          />
          {previewUrl ? (
            <Image src={previewUrl} alt="Cover Preview" fill className="object-cover" unoptimized />
          ) : (
            <div className="text-foreground/40 flex flex-col items-center gap-2">
              <ImageIcon className="h-8 w-8" />
              <span className="text-sm">點擊上傳封面圖</span>
            </div>
          )}
        </div>
      </div>

      {/* 標題與 Slug */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="輸入文章標題..."
          className="placeholder:text-foreground/30 w-full border-none bg-transparent text-4xl font-bold outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="text-foreground/50 flex items-center gap-2">
          <span className="text-sm">/posts/</span>
          <input
            type="text"
            placeholder="url-slug"
            className="focus:border-primary text-primary w-full border-b border-transparent bg-transparent font-mono text-sm transition-colors outline-none hover:border-[color:var(--border)]"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={isEditing}
          />
        </div>
      </div>

      {/* 分類與標籤 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-foreground/60 text-sm font-medium">
            文章分類 <span className="text-foreground/40 text-xs">(單選)</span>
          </label>
          <SmartSelector
            placeholder="搜尋或建立分類..."
            items={availableCategories}
            selectedItems={selectedCategories}
            onSelect={(item) => setSelectedCategories([item])} // 強制單選
            onRemove={(id) => setSelectedCategories(selectedCategories.filter((c) => c.id !== id))}
            onCreate={onCreateCategory}
            limit={1}
          />
        </div>

        <div className="space-y-2">
          <label className="text-foreground/60 text-sm font-medium">
            文章標籤 <span className="text-foreground/40 text-xs">(最多 5 個)</span>
          </label>
          <SmartSelector
            placeholder="搜尋或建立標籤..."
            items={availableTags}
            selectedItems={selectedTags}
            onSelect={(item) => {
              if (!selectedTags.find((t) => t.id === item.id)) {
                setSelectedTags([...selectedTags, item]);
              }
            }}
            onRemove={(id) => setSelectedTags(selectedTags.filter((t) => t.id !== id))}
            onCreate={onCreateTag}
            limit={5}
          />
        </div>
      </div>

      {/* 摘要 */}
      <TextareaAutosize
        placeholder="輸入文章摘要 (Excerpt)..."
        className="bg-card/50 text-foreground/80 w-full resize-none rounded-lg border border-transparent p-4 text-sm leading-relaxed transition-all outline-none focus:border-[color:var(--border)]"
        minRows={3}
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
      />

      <hr className="border-[color:var(--border)]" />
    </div>
  );
}
