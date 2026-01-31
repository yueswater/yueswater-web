"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { postService } from "@/services/postService";
import { Category, Tag, Post } from "@/types";

import { EditorHeader } from "@/app/admin/components/EditorHeader";
import { MarkdownToolbar } from "@/app/admin/components/MarkdownToolbar";
import { PostMetaForm } from "@/app/admin/components/PostMetaForm";
import { EditorPreview } from "@/app/admin/components/EditorPreview";
import { EditorInput } from "@/app/admin/components/EditorInput";
import { ImageUploadModal } from "@/app/admin/components/ImageUploadModal";

export default function WritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const stateRef = useRef({
    title,
    slug,
    content,
    excerpt,
    currentSlug,
    coverImage,
    selectedCategories,
    selectedTags,
  });

  useEffect(() => {
    stateRef.current = {
      title,
      slug,
      content,
      excerpt,
      currentSlug,
      coverImage,
      selectedCategories,
      selectedTags,
    };
  }, [title, slug, content, excerpt, currentSlug, coverImage, selectedCategories, selectedTags]);

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

        const editSlug = searchParams.get("edit");
        if (editSlug) {
          const posts = await postService.getAllPosts();
          const postToEdit = posts.find((p: Post) => p.slug === editSlug);
          
          if (postToEdit) {
            setCurrentSlug(postToEdit.slug);
            setTitle(postToEdit.title);
            setSlug(postToEdit.slug);
            setContent(postToEdit.content);
            setExcerpt(postToEdit.excerpt || "");
            if (postToEdit.cover_image) {
              setPreviewUrl(postToEdit.cover_image);
            }
            if (postToEdit.category) {
              setSelectedCategories([postToEdit.category]);
            }
            if (postToEdit.tags) {
              setSelectedTags(postToEdit.tags);
            }
          }
        }
      } catch (error) {
        showToast("載入資料失敗", "error");
      }
    };
    fetchData();
  }, [user, isLoading, router, showToast, searchParams]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (file: File, altText: string, width: number, height: number) => {
    try {
      const result = await postService.uploadImage(file, slug);
      const figId = `fig-${Math.random().toString(36).substring(2, 8)}`;
      const htmlImage = `<img src="${result.image}" id="${figId}" alt="${altText}" width="${width}" height="${height}" style="max-width: 100%; height: auto; margin: 2rem auto; display: block;">`;
      insertMarkdown(htmlImage);
      showToast(`圖片已插入，參照 ID: @${figId}`, "success");
    } catch (error) {
      showToast("圖片上傳失敗", "error");
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

  const handleSubmit = useCallback(async (action: "draft" | "publish", silent = false) => {
    const s = stateRef.current;
    if (!s.title || !s.slug || !s.content) {
      if (!silent) showToast("標題、Slug 和內容為必填項", "error");
      return;
    }
    
    if (!silent) setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("title", s.title);
      formData.append("slug", s.slug);
      formData.append("content", s.content);
      formData.append("excerpt", s.excerpt);

      const isDraft = action === "draft";
      formData.append("is_draft", String(isDraft));
      formData.append("is_published", String(!isDraft));
      formData.append("is_archived", "false");

      if (s.coverImage) {
        formData.append("cover_image", s.coverImage);
      }

      if (s.selectedCategories.length > 0) {
        formData.append("category_id", s.selectedCategories[0].id.toString());
      }

      s.selectedTags.forEach((tag) => {
        formData.append("tags_ids", tag.id.toString());
      });

      let response;
      if (s.currentSlug) {
        response = await postService.updatePost(s.currentSlug, formData);
      } else {
        response = await postService.createPost(formData);
        setCurrentSlug(response.slug);
      }

      if (!silent) {
        showToast(isDraft ? "草稿儲存成功" : "文章發布成功", "success");
        if (!isDraft) router.push("/");
      } else {
        console.log("Auto-saved at", new Date().toLocaleTimeString());
      }
    } catch (error) {
      if (!silent) showToast("操作失敗", "error");
    } finally {
      if (!silent) setIsSubmitting(false);
    }
  }, [showToast, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSubmit("draft");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleSubmit("draft", true);
    }, 30000);
    return () => clearInterval(interval);
  }, [handleSubmit]);

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