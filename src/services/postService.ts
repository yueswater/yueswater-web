import { apiClient } from "./apiClient";
import { Category, Post, Tag, Comment } from "@/types";

export const postService = {
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

  viewPost: async (slug: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}/view/`, {
        method: "POST",
      });
    } catch (error) {
      console.error("記錄瀏覽失敗:", error);
    }
  },

  getPublishedPosts: async () => {
    const posts = await apiClient<Post[]>("/posts/", { skipAuth: true });
    return posts.filter((p) => p.is_published && !p.is_draft);
  },

  getFeaturedPost: async () => {
    const posts = await postService.getPublishedPosts();
    return posts.length > 0 ? posts[0] : null;
  },

  getCategories: async () => {
    return apiClient<Category[]>("/categories/", { skipAuth: true });
  },

  getTags: async () => {
    return apiClient<Tag[]>("/tags/", { skipAuth: true });
  },

  createCategory: async (name: string) => {
    return apiClient<Category>("/categories/", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  createTag: async (name: string) => {
    return apiClient<Tag>("/tags/", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  uploadImage: async (file: File, slug?: string) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);
    if (slug) {
      formData.append("slug", slug);
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "圖片上傳失敗");
    }
    return res.json();
  },

  toggleLike: async (postId: number) => {
    return apiClient<{ liked: boolean; likes_count: number }>("/likes/toggle/", {
      method: "POST",
      body: JSON.stringify({ post: postId }),
    });
  },

  getPostLikeStatus: async (postId: number) => {
    return apiClient<{ liked: boolean; likes_count: number }>(`/likes/status/?post_id=${postId}`, {
      skipAuth: true,
    });
  },

  toggleBookmark: async (postId: number) => {
    return apiClient<{ bookmarked: boolean }>("/bookmarks/toggle/", {
      method: "POST",
      body: JSON.stringify({ post: postId }),
    });
  },

  getBookmarkStatus: async (postId: number) => {
    return apiClient<{ bookmarked: boolean }>(`/bookmarks/status/?post_id=${postId}`);
  },

  getMyBookmarks: async () => {
    return apiClient<any[]>("/bookmarks/my_list/");
  },

  getComments: async (slug: string) => {
    return apiClient<Comment[]>(`/comments/?post_slug=${slug}`, {
      skipAuth: true,
    });
  },

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