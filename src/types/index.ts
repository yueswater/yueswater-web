// 使用者
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string | null;
  first_name?: string;
  last_name?: string;
  bio?: string;
}

// 分類
export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// 標籤
export interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// 評論
export interface Comment {
  id: number;
  user: User;
  content: string;
  created_at: string;
}

// 文章
export interface Post {
  id: number;
  uuid?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string | null;
  // 狀態相關
  is_draft: boolean;
  is_published: boolean;
  is_archived: boolean;
  // 關聯資料
  author: User;
  category: Category | null;
  tags: Tag[];
  // 時間戳記
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // 社群互動欄位
  view_count?: number;
  likes_count?: number;
  is_liked?: boolean;
  comments?: Comment[];
}
