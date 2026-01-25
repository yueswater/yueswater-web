"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Droplets, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      const focusableElements: (HTMLInputElement | HTMLButtonElement | null)[] = [
        usernameInputRef.current,
        emailInputRef.current,
        passwordInputRef.current,
        submitButtonRef.current,
      ];
      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLInputElement | HTMLButtonElement | null
      );

      if (e.shiftKey) {
        if (currentIndex <= 0) {
          e.preventDefault();
          submitButtonRef.current?.focus();
        }
      } else {
        if (currentIndex >= focusableElements.length - 1) {
          e.preventDefault();
          usernameInputRef.current?.focus();
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "註冊失敗");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <div className="bg-transparent text-base-100 mx-auto w-fit rounded-2xl p-3">
            <Droplets className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold">請檢查您的電子信箱</h1>
          <p className="text-foreground/60">
            我們已將驗證連結寄送至 <span className="text-foreground font-medium">{formData.email}</span>。請點擊連結以啟用您的帳號。
          </p>
          <Link href="/login" className="btn btn-primary rounded-full px-8">
            前往登入
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="bg-transparent text-primary mx-auto w-fit rounded-2xl p-3">
            <Droplets className="h-10 w-10" />
          </div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">建立帳號</h1>
          <p className="text-foreground/60 mt-2 text-sm">加入岳氏礦泉水，開始分享您的故事</p>
        </div>

        <div className="bg-card rounded-2xl border border-[color:var(--border)] p-8 shadow-sm">
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="text-foreground text-sm font-medium">
                使用者名稱
              </label>
              <input
                ref={usernameInputRef}
                id="username"
                type="text"
                required
                className="bg-background text-foreground focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-[color:var(--border)] px-3 py-2 transition-all focus:ring-2 focus:outline-none"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-foreground text-sm font-medium">
                電子郵件
              </label>
              <input
                ref={emailInputRef}
                id="email"
                type="email"
                required
                className="bg-background text-foreground focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-[color:var(--border)] px-3 py-2 transition-all focus:ring-2 focus:outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-foreground text-sm font-medium">
                密碼
              </label>
              <div className="relative">
                <input
                  ref={passwordInputRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="bg-background text-foreground focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-[color:var(--border)] px-3 py-2 pr-10 transition-all focus:ring-2 focus:outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-foreground/40 hover:text-primary absolute inset-y-0 right-0 flex items-center px-3 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              ref={submitButtonRef}
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground focus:ring-primary/20 flex w-full items-center justify-center rounded-lg border border-transparent px-4 py-2.5 font-medium transition-all hover:opacity-90 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  註冊
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-foreground/60">已經有帳號了？</span>
            <Link
              href="/login"
              tabIndex={-1}
              className="text-primary hover:text-primary/80 ml-1 font-medium hover:underline"
            >
              立即登入
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}