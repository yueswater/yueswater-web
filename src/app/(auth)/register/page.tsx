"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Droplets, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("帳號或密碼錯誤");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "登入失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 text-primary mb-4 rounded-2xl p-3">
            <Droplets className="h-10 w-10" />
          </div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">歡迎回來</h1>
          <p className="text-foreground/60 mt-2 text-sm">請輸入您的帳號密碼以繼續</p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                id="username"
                type="text"
                required
                className="bg-background text-foreground focus:ring-primary/20 focus:border-primary w-full rounded-lg px-3 py-2 transition-all focus:ring-2 focus:outline-none"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-foreground text-sm font-medium">
                  密碼
                </label>
                <Link
                  href="/forgot-password"
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  忘記密碼？
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                className="bg-background text-foreground focus:ring-primary/20 focus:border-primary w-full rounded-lg px-3 py-2 transition-all focus:ring-2 focus:outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground focus:ring-primary/20 flex w-full items-center justify-center rounded-lg px-4 py-2.5 font-medium transition-all hover:opacity-90 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  登入
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-foreground/60">還沒有帳號？</span>
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 ml-1 font-medium hover:underline"
            >
              立即註冊
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
