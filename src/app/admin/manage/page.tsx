"use client";

import { useState, useEffect } from "react";
import { postService } from "@/services/postService";
import { Post } from "@/types";
import { useToast } from "@/context/ToastContext";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { PostManageTable } from "@/app/admin/components/PostManageTable";

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchPosts = async () => {
    try {
      const data = await postService.getAllPosts();
      setPosts(data);
    } catch (error) {
      showToast("載入文章失敗", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleToggleStatus = async (slug: string, type: "draft" | "publish" | "archive") => {
    let statusData = {};
    if (type === "draft") statusData = { is_draft: true, is_published: false, is_archived: false };
    if (type === "publish") statusData = { is_draft: false, is_published: true, is_archived: false };
    if (type === "archive") statusData = { is_draft: false, is_published: false, is_archived: true };

    try {
      await postService.updatePostStatus(slug, statusData);
      showToast("狀態更新成功", "success");
      fetchPosts();
    } catch (error) {
      showToast("更新失敗", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen p-8 text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">文章管理</h1>
          <Link
            href="/admin/write"
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
          >
            撰寫新文章
          </Link>
        </div>

        <PostManageTable posts={posts} onToggleStatus={handleToggleStatus} />
      </div>
    </div>
  );
}