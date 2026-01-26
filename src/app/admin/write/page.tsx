"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { postService } from "@/services/postService";
import { Category, Tag } from "@/types";

import { EditorHeader } from "@/app/admin/components/EditorHeader";
import { MarkdownToolbar } from "@/app/admin/components/MarkdownToolbar";
import { PostMetaForm } from "@/app/admin/components/PostMetaForm";
import { EditorPreview } from "@/app/admin/components/EditorPreview";
import { EditorInput } from "@/app/admin/components/EditorInput";
import { ImageUploadModal } from "@/app/admin/components/ImageUploadModal";

export default function WritePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { showToast } = useToast();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [currentSlug, setCurrentSlug] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login?redirect=/admin/write");
      return;
    }

    if (user.username !== "yueswater") {
      showToast("你沒有權限進入此頁面", "error");
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
        showToast("載入分類標籤失敗", "error");
      }
    };
    fetchData();
  }, [user, isLoading, router, showToast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (file: File, altText: string) => {
    try {
      const result = await postService.uploadImage(file, slug);
      const markdownImage = `![${altText}](${result.image})`;
      insertMarkdown(markdownImage);
    } catch (error) {
      showToast("圖片上傳失敗，請檢查後端日誌", "error");
      throw error;
    }
  };

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

  const handleSubmit = async (action: "draft" | "publish") => {
    if (!title || !slug || !content) {
      showToast("標題、Slug 和內容為必填項", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("content", content);
      formData.append("excerpt", excerpt);

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

      showToast(isDraft ? "草稿儲存成功" : "文章發布成功", "success");
      if (!isDraft) router.push("/");
    } catch (error) {
      showToast("操作失敗，請檢查主控台", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCategory = async (name: string) => {
    try {
      const newCat = await postService.createCategory(name);
      setAvailableCategories((prev) => [...prev, newCat]);
      if (selectedCategories.length === 0) setSelectedCategories([newCat]);
      showToast("分類創建成功", "success");
    } catch (e) {
      showToast("創建分類失敗", "error");
    }
  };

  const handleCreateTag = async (name: string) => {
    try {
      const newTag = await postService.createTag(name);
      setAvailableTags((prev) => [...prev, newTag]);
      if (selectedTags.length < 5) setSelectedTags((prev) => [...prev, newTag]);
      showToast("標籤創建成功", "success");
    } catch (e) {
      showToast("創建標籤失敗", "error");
    }
  };

  if (isLoading) return null;

  return (
    <div className="bg-background text-foreground flex h-screen flex-col">
      <EditorHeader
        isEditing={!!currentSlug}
        isSubmitting={isSubmitting}
        onSaveDraft={() => handleSubmit("draft")}
        onPublish={() => handleSubmit("publish")}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="bg-background/50 flex w-1/2 flex-col border-r border-[color:var(--border)]">
          <MarkdownToolbar
            onInsert={insertMarkdown}
            onImageClick={() => setIsImageModalOpen(true)}
          />

          <div className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto w-full max-w-3xl">
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

              <EditorInput
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="開始撰寫 Markdown 內容..."
              />
            </div>
          </div>
        </div>

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