const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api").replace(/\/+$/, "");

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;
  
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (!cleanEndpoint.includes("?") && !cleanEndpoint.endsWith("/")) {
    cleanEndpoint = `${cleanEndpoint}/`;
  }

  const getHeaders = (token: string | null) => {
    const h = new Headers(fetchOptions.headers);
    if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
      h.set("Content-Type", "application/json");
    }
    if (!skipAuth && token) {
      h.set("Authorization", `Bearer ${token}`);
    }
    return h;
  };

  const currentToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
    ...fetchOptions,
    headers: getHeaders(currentToken),
  });

  const isLoginRequest = cleanEndpoint.includes("/login/");
  const isRefreshRequest = cleanEndpoint.includes("/refresh/");

  if ((response.status === 401 || response.status === 403) && !skipAuth && !isLoginRequest && !isRefreshRequest) {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

    if (!refreshToken) {
      if (typeof window !== "undefined") {
        localStorage.clear();
        if (window.location.pathname !== "/login") {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }
      throw new Error("Session expired");
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          if (!newToken) return reject(new Error("Refresh failed"));
          fetch(`${BASE_URL}${cleanEndpoint}`, {
            ...fetchOptions,
            headers: getHeaders(newToken),
          })
            .then((res) => res.json())
            .then(resolve)
            .catch(reject);
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshResponse.ok) {
        const { access } = await refreshResponse.json();
        localStorage.setItem("token", access);
        onRefreshed(access);
        
        const retryResponse = await fetch(`${BASE_URL}${cleanEndpoint}`, {
          ...fetchOptions,
          headers: getHeaders(access),
        });
        return retryResponse.json();
      } else {
        localStorage.clear();
        onRefreshed("");
        if (window.location.pathname !== "/login") {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
        throw new Error("Refresh token invalid");
      }
    } finally {
      isRefreshing = false;
      refreshSubscribers = [];
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.detail || errorData.message || "Request failed";
    throw new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
  }

  return response.json();
}