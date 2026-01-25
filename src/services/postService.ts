import { apiClient } from "./apiClient";
import { Category, Post, Tag } from "@/types";

export const postService = {
  // 建立文章
  createPost: async (formData: FormData) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "發布文章失敗");
    }

    return res.json();
  },

  // 更新現有文章
  updatePost: async (slug: string, formData: FormData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}/`, {
      method: "PATCH",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!res.ok) throw new Error("更新文章失敗");
    return res.json();
  },

  // 記錄瀏覽次數
  viewPost: async (slug: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}/view/`, {
        method: "POST",
      });
    } catch (error) {
      console.error("記錄瀏覽失敗:", error);
    }
  },

  // 獲取已發布文章列表
  getPublishedPosts: async () => {
    const posts = await apiClient<Post[]>("/posts/", { skipAuth: true });
    return posts.filter((p) => p.is_published && !p.is_draft);
  },

  // 獲取熱門文章
  getFeaturedPost: async () => {
    const posts = await postService.getPublishedPosts();
    return posts.length > 0 ? posts[0] : null;
  },

  // 獲取所有分類
  getCategories: async () => {
    return apiClient<Category[]>("/categories/", { skipAuth: true });
  },

  // 獲取所有標籤
  getTags: async () => {
    return apiClient<Tag[]>("/tags/", { skipAuth: true });
  },

  // 建立分類
  createCategory: async (name: string) => {
    return apiClient<Category>("/categories/", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  // 建立標籤
  createTag: async (name: string) => {
    return apiClient<Tag>("/tags/", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  // 上傳圖片
  uploadImage: async (file: File, slug?: string) => {
    // 取得 token
    const token = localStorage.getItem("token");
    // 建立 FormData
    const formData = new FormData();
    formData.append("image", file);
    // 如果有 slug 則附加到 FormData
    if (slug) {
      formData.append("slug", slug);
    }
    // 發送請求
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    // 錯誤處理
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "圖片上傳失敗");
    }
    return res.json();
  },
  // 按讚
  toggleLike: async (postId: number) => {
    return apiClient<{ liked: boolean; likes_count: number }>("/likes/toggle/", {
      method: "POST",
      body: JSON.stringify({ post: postId }),
    });
  },
  // 獲取按讚狀態
  getPostLikeStatus: async (postId: number) => {
    return apiClient<{ liked: boolean; likes_count: number }>(`/likes/status/?post_id=${postId}`, {
      skipAuth: true,
    });
  },
  // 獲取留言列表
  getComments: async (slug: string) => {
    return apiClient<Comment[]>(`/comments/?post_slug=${slug}`, {
      skipAuth: true, // 開放讀取
    });
  },

  // 發表留言
  createComment: async (postId: number, content: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ post: postId, content }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const msg = errorData.content?.[0] || errorData.detail || "留言發送失敗";

      throw new Error(msg);
    }

    return res.json();
  },

  // 更新留言
  updateComment: async (commentId: number, content: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "更新留言失敗");
    }
    return res.json();
  },

  // 刪除留言
  deleteComment: async (commentId: number) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}/`, {
      method: "DELETE",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      throw new Error("刪除留言失敗");
    }
    return true;
  },
};
