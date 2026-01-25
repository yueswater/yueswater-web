"use client";

import { useState } from "react";
import Link from "next/link";
import { authService } from "@/services/authService";
import { Droplets, Loader2, ArrowRight, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.requestPasswordReset(email);
      setIsSent(true);
    } catch (err: any) {
      setError(err.message || "請求失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center p-4 pt-16">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="bg-transparent text-primary mx-auto w-fit rounded-2xl p-3">
            <Droplets className="h-10 w-10" />
          </div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">重設密碼</h1>
          <p className="text-foreground/60 mt-2 text-sm">
            請輸入您的電子郵件，我們將向您發送重設密碼的連結
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-[color:var(--border)] p-8 shadow-sm">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-foreground text-sm font-medium">
                  電子郵件
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    className="bg-background text-foreground focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-[color:var(--border)] px-3 py-2 pl-10 transition-all focus:ring-2 focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="text-foreground/40 absolute left-3 top-2.5 h-5 w-5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground focus:ring-primary/20 flex w-full items-center justify-center rounded-lg border border-transparent px-4 py-2.5 font-medium transition-all hover:opacity-90 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    發送重設連結
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="flex justify-center">
                <div className="bg-green-500/10 text-green-500 rounded-2xl p-3">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold">郵件已寄出</h2>
                <p className="text-foreground/60 text-sm">
                  請檢查您的信箱 <strong>{email}</strong>，並點擊信中的連結來重設密碼。
                </p>
              </div>
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 block text-sm font-medium"
              >
                返回登入
              </Link>
            </div>
          )}

          {!isSent && (
            <div className="mt-6 text-center text-sm">
              <Link
                href="/login"
                className="text-foreground/60 hover:text-primary font-medium transition-colors"
              >
                返回登入
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}