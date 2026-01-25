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
    return apiClient<{ id: number; username: string }>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  refreshToken: async (refresh: string) => {
    return apiClient<{ access: string }>("/auth/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
    });
  },
};
