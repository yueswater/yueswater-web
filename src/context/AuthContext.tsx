"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, LoginResponse } from "@/types/auth";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  login: (credentials: Record<string, string>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: Record<string, string>) => {
    try {
      const data: LoginResponse = await authService.login(credentials);

      localStorage.setItem("token", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      const userData: User = {
        id: data.user_id,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      router.push("/");
      router.refresh();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn("Logout API failed (likely token expired), forcing local logout.", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);

      router.push("/login");
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
