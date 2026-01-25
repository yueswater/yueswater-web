const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  console.log("當前 API 網址:", process.env.NEXT_PUBLIC_API_URL);
  const { skipAuth = false, ...fetchOptions } = options;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    ...fetchOptions.headers,
  };

  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (!skipAuth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || "API 請求失敗");
  }

  return response.json();
}
