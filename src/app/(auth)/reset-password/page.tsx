"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { Droplets, Loader2, ArrowRight, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    if (!uid || !token) {
      setError("無效的重設連結。");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.resetPasswordConfirm({
        uid,
        token,
        new_password: newPassword,
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "重設密碼失敗，請重新申請連結。");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-card rounded-2xl border border-[color:var(--border)] p-8 shadow-sm text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-green-500/10 text-green-500 rounded-2xl p-3">
            <CheckCircle2 className="h-10 w-10" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">密碼重設成功</h2>
          <p className="text-foreground/60 text-sm">您的新密碼已設定完成，3 秒後將自動跳轉至登入頁面。</p>
        </div>
        <Link
          href="/login"
          className="bg-primary text-primary-foreground flex w-full items-center justify-center rounded-lg px-4 py-2.5 font-medium transition-all hover:opacity-90"
        >
          立即前往登入
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-[color:var(--border)] p-8 shadow-sm space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">設定新密碼</h1>
        <p className="text-foreground/60 text-sm">請輸入您的新密碼以完成重設</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="password" className="text-foreground text-sm font-medium">
            新密碼
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="至少 8 個字元"
              className="bg-background text-foreground focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-[color:var(--border)] px-3 py-2 pl-10 pr-10 transition-all focus:ring-2 focus:outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Lock className="text-foreground/40 absolute left-3 top-2.5 h-5 w-5" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-foreground/40 hover:text-primary absolute right-3 top-2.5 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
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
              確認重設密碼
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center p-4 pt-16">
      <div className="w-full max-w-md">
        <Suspense 
          fallback={
            <div className="bg-card rounded-2xl border border-[color:var(--border)] p-8 shadow-sm flex justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>

        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Droplets className="h-6 w-6" />
            <span className="tracking-widest uppercase">Yueswater</span>
          </div>
        </div>
      </div>
    </div>
  );
}