import { apiClient } from "./apiClient";
import { Category, Post, Tag, Comment } from "@/types";

export const postService = {
  getAllPosts: async () => {
    return apiClient<Post[]>("/posts/", { skipAuth: false });
  },

  createPost: async (formData: FormData) => {
    return apiClient<Post>("/posts/", {
      method: "POST",
      body: formData,
    });
  },

  updatePost: async (slug: string, formData: FormData) => {
    return apiClient<Post>(`/posts/${slug}/`, {
      method: "PATCH",
      body: formData,
    });
  },

  viewPost: async (slug: string) => {
    try {
      await apiClient(`/posts/${slug}/view/`, {
        method: "POST",
        skipAuth: true,
      });
    } catch (error) {
      console.error("記錄瀏覽失敗:", error);
    }
  },

  updatePostStatus: async (slug: string, statusData: { is_draft?: boolean, is_published?: boolean, is_archived?: boolean }) => {
    return apiClient<Post>(`/posts/${slug}/`, {
      method: "PATCH",
      body: JSON.stringify(statusData),
    });
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
    const formData = new FormData();
    formData.append("image", file);
    if (slug) {
      formData.append("slug", slug);
    }
    return apiClient<{ uuid: string; image: string; alt_text: string }>("/upload/", {
      method: "POST",
      body: formData,
    });
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
    return apiClient<Comment>("/comments/", {
      method: "POST",
      body: JSON.stringify({ post: postId, content }),
    });
  },

  updateComment: async (commentId: number, content: string) => {
    return apiClient<Comment>(`/comments/${commentId}/`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    });
  },

  deleteComment: async (commentId: number) => {
    await apiClient(`/comments/${commentId}/`, {
      method: "DELETE",
    });
    return true;
  },

  downloadPostPdf: async (slug: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}/download-pdf/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      alert(`PDF 產生失敗：\n${error.message}`);
      console.error("下載 PDF 失敗:", error);
    }
  },
};