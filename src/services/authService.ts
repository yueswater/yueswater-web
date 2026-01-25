import { apiClient } from "./apiClient";
import { LoginResponse } from "@/types/auth";

export const authService = {
  login: async (credentials: Record<string, string>) => {
    return apiClient<LoginResponse>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  logout: async () => {
    return apiClient<{ detail: string }>("/auth/logout/", {
      method: "POST",
    });
  },

  register: async (data: Record<string, string>) => {
    return apiClient<{ id: string; username: string }>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  verifyEmail: async (uid: string, token: string) => {
    return apiClient<{ detail: string }>(`/auth/verify-email/?uid=${uid}&token=${token}`, {
      method: "GET",
    });
  },

  refreshToken: async (refresh: string) => {
    return apiClient<{ access: string }>("/auth/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
    });
  },

  requestPasswordReset: async (email: string) => {
    return apiClient<{ detail: string }>("/auth/password-reset/", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPasswordConfirm: async (data: Record<string, string>) => {
    return apiClient<{ detail: string }>("/auth/password-reset-confirm/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};