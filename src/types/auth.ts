export interface LoginResponse {
  access: string;
  refresh: string;
  user_id: number;
  username: string;
  email: string;
  avatar: string | null;
  first_name?: string; 
  last_name?: string;
}
