"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { Droplets, Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const verified = useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (verified.current) return;
      
      const uid = searchParams.get("uid");
      const token = searchParams.get("token");

      if (!uid || !token) {
        setStatus("error");
        setMessage("無效的驗證連結。");
        return;
      }

      try {
        verified.current = true;
        const response = await authService.verifyEmail(uid, token);
        
        if (response.detail === "already_active") {
          router.push("/login");
          return;
        }

        setStatus("success");
        
        setTimeout(() => {
          router.push("/login");
        }, 3000);

      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "驗證失敗或連結已過期。");
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="bg-card rounded-2xl border border-[color:var(--border)] p-8 shadow-sm space-y-6">
      <div className="flex justify-center">
        {status === "loading" && (
          <div className="bg-primary/10 text-primary rounded-2xl p-3">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}
        {status === "success" && (
          <div className="bg-green-500/10 text-green-500 rounded-2xl p-3">
            <CheckCircle2 className="h-10 w-10" />
          </div>
        )}
        {status === "error" && (
          <div className="bg-red-500/10 text-red-500 rounded-2xl p-3">
            <XCircle className="h-10 w-10" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          {status === "loading" && "正在驗證您的電子郵件..."}
          {status === "success" && "帳號驗證成功！"}
          {status === "error" && "驗證失敗"}
        </h1>
        <p className="text-foreground/60 text-sm">
          {status === "loading" && "請稍候，我們正在處理您的請求。"}
          {status === "success" && "您的帳號已成功啟用，3 秒後將自動跳轉至登入頁面。"}
          {status === "error" && message}
        </p>
      </div>

      {status !== "loading" && (
        <div className="pt-4">
          <Link
            href="/login"
            className="bg-primary text-primary-foreground flex w-full items-center justify-center rounded-lg px-4 py-2.5 font-medium transition-all hover:opacity-90"
          >
            <span className="flex items-center gap-2">
              前往登入
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center p-4">
      <div className="w-full max-w-md text-center">
        <Suspense 
          fallback={
            <div className="bg-card rounded-2xl border border-[color:var(--border)] p-8 shadow-sm flex justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          }
        >
          <VerifyEmailContent />
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