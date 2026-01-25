"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { postService } from "@/services/postService";
import { Category, Tag } from "@/types";

// 引入拆分後的組件
import { EditorHeader } from "@/app/admin/components/EditorHeader";
import { MarkdownToolbar } from "@/app/admin/components/MarkdownToolbar";
import { PostMetaForm } from "@/app/admin/components/PostMetaForm";
import { EditorPreview } from "@/app/admin/components/EditorPreview";
import { EditorInput } from "@/app/admin/components/EditorInput";
import { ImageUploadModal } from "@/app/admin/components/ImageUploadModal";

export default function WritePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [currentSlug, setCurrentSlug] = useState<string | null>(null);

  // 表單狀態
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // 分類與標籤狀態
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 初始化與權限檢查
  useEffect(() => {
    if (isLoading) return;

    // 尚未登入則跳轉至登入頁
    if (!user) {
      router.push("/login?redirect=/admin/write");
      return;
    }

    // 有登入但權限不足則跳回首頁
    if (user.username !== "yueswater") {
      alert("你沒有權限進入此頁面");
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [cats, tags] = await Promise.all([
          postService.getCategories(),
          postService.getTags(),
        ]);
        setAvailableCategories(cats);
        setAvailableTags(tags);
      } catch (error) {
        console.error("載入分類標籤失敗", error);
      }
    };
    fetchData();
  }, [user, isLoading, router]);

  // 處理圖片變更
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (file: File, altText: string) => {
    try {
      // 將把目前的 slug 傳進去
      const result = await postService.uploadImage(file, slug);

      // 組合 Markdown 語法
      const markdownImage = `![${altText}](${result.image})`;

      // 插入到編輯器中
      insertMarkdown(markdownImage);
    } catch (error) {
      console.error(error);
      alert("圖片上傳失敗 請檢查後端日誌");
      throw error;
    }
  };

  // 處理插入 Markdown 語法
  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selection.length + suffix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // 處理提交
  const handleSubmit = async (action: "draft" | "publish") => {
    if (!title || !slug || !content) {
      alert("標題 Slug 和 內容 為必填");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("content", content);
      formData.append("excerpt", excerpt);

      // 設定狀態
      const isDraft = action === "draft";
      formData.append("is_draft", String(isDraft));
      formData.append("is_published", String(!isDraft));
      formData.append("is_archived", "false");

      if (coverImage) {
        formData.append("cover_image", coverImage);
      }

      selectedCategories.forEach((cat) => formData.append("categories", cat.id.toString()));
      selectedTags.forEach((tag) => formData.append("tags", tag.id.toString()));

      let response;
      if (currentSlug) {
        response = await postService.updatePost(currentSlug, formData);
      } else {
        response = await postService.createPost(formData);
        setCurrentSlug(response.slug);
      }

      alert(isDraft ? "草稿儲存成功" : "文章發布成功");
      if (!isDraft) router.push("/");
    } catch (error) {
      console.error(error);
      alert("操作失敗 請檢查 Console");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 建立分類邏輯
  const handleCreateCategory = async (name: string) => {
    try {
      const newCat = await postService.createCategory(name);
      setAvailableCategories((prev) => [...prev, newCat]);
      if (selectedCategories.length === 0) setSelectedCategories([newCat]);
    } catch (e) {
      alert("創建分類失敗");
    }
  };

  // 建立標籤邏輯
  const handleCreateTag = async (name: string) => {
    try {
      const newTag = await postService.createTag(name);
      setAvailableTags((prev) => [...prev, newTag]);
      if (selectedTags.length < 5) setSelectedTags((prev) => [...prev, newTag]);
    } catch (e) {
      alert("創建標籤失敗");
    }
  };

  if (isLoading) return null;

  return (
    <div className="bg-background text-foreground flex h-screen flex-col">
      {/* Header 組件 */}
      <EditorHeader
        isEditing={!!currentSlug}
        isSubmitting={isSubmitting}
        onSaveDraft={() => handleSubmit("draft")}
        onPublish={() => handleSubmit("publish")}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* 左側編輯區 */}
        <div className="bg-background/50 flex w-1/2 flex-col border-r border-[color:var(--border)]">
          {/* Toolbar 組件 */}
          <MarkdownToolbar
            onInsert={insertMarkdown}
            onImageClick={() => setIsImageModalOpen(true)}
          />

          {/* Editor Form */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto w-full max-w-3xl">
              {/* Meta Form 組件 */}
              <PostMetaForm
                title={title}
                setTitle={setTitle}
                slug={slug}
                setSlug={setSlug}
                excerpt={excerpt}
                setExcerpt={setExcerpt}
                previewUrl={previewUrl}
                onImageChange={handleImageChange}
                availableCategories={availableCategories}
                availableTags={availableTags}
                selectedCategories={selectedCategories}
                selectedTags={selectedTags}
                setSelectedCategories={setSelectedCategories}
                setSelectedTags={setSelectedTags}
                onCreateCategory={handleCreateCategory}
                onCreateTag={handleCreateTag}
                isEditing={!!currentSlug}
              />

              {/* 主要編輯區 */}
              <EditorInput
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="開始撰寫 Markdown 內容..."
              />
            </div>
          </div>
        </div>

        {/* 右側即時預覽區 */}
        <div className="bg-card/30 w-1/2 overflow-y-auto border-l border-[color:var(--border)]">
          <div className="mx-auto max-w-3xl p-8">
            <div className="text-foreground/40 mb-8 text-center text-xs font-bold tracking-widest uppercase opacity-50">
              Preview Mode
            </div>
            {title && <h1 className="text-foreground mb-8 text-4xl font-bold">{title}</h1>}
            <EditorPreview content={content} />
          </div>
        </div>
      </div>

      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onUpload={handleImageUpload}
      />
    </div>
  );
}
