const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api").replace(/\/+$/, "");

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (!cleanEndpoint.includes("?") && !cleanEndpoint.endsWith("/")) {
    cleanEndpoint = `${cleanEndpoint}/`;
  }

  const headers: Record<string, string> = {
    ...fetchOptions.headers,
  };

  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (!skipAuth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.detail || errorData.message || "API 請求失敗";
    throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
  }

  return response.json();
}