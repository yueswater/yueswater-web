// 定義使用者型別
export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
}

// 定義登入回傳型別
export interface LoginResponse {
  access: string;
  refresh: string;
  user_id: number;
  username: string;
  email: string;
  avatar: string | null;
}
