"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";
import { Droplets, Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
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
        setMessage("Invalid verification link.");
        return;
      }

      try {
        verified.current = true;
        await authService.verifyEmail(uid, token);
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Verification failed or link expired.");
      }
    };

    verify();
  }, [searchParams]);

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
          {status === "loading" && "Verifying your email..."}
          {status === "success" && "Account Verified!"}
          {status === "error" && "Verification Failed"}
        </h1>
        <p className="text-foreground/60 text-sm">
          {status === "loading" && "Please wait while we validate your account."}
          {status === "success" && "Your account has been successfully activated. You can now log in."}
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
              Go to Login
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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
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