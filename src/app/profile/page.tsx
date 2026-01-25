"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, UserCircle, KeyRound, Loader2 } from "lucide-react";
import { ProfileForm } from "@/components/features/auth/ProfileForm";
import { AvatarUpload } from "@/components/features/auth/AvatarUpload";
import { PasswordForm } from "@/components/features/auth/PasswordForm";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "security">("info");

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-10 flex flex-col items-center gap-6 md:flex-row md:items-start">
        <AvatarUpload />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">{user?.username}</h1>
          <p className="text-foreground/60">{user?.email}</p>
          <div className="mt-3 flex gap-2">
            <span className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase">
              專業版 <ShieldCheck className="h-3 w-3" />
            </span>
            <span className="bg-green-500/10 text-green-500 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase">
              ACTIVE
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition-all ${
                activeTab === "info" ? "bg-primary text-primary-foreground" : "hover:bg-base-200"
              }`}
            >
              <UserCircle className="h-5 w-5" /> 帳戶資訊
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition-all ${
                activeTab === "security" ? "bg-primary text-primary-foreground" : "hover:bg-base-200"
              }`}
            >
              <KeyRound className="h-5 w-5" /> 安全設定
            </button>
          </nav>
        </aside>

        <main className="md:col-span-3">
          <div className="bg-card rounded-3xl border border-base-200 p-6 shadow-sm md:p-8">
            {activeTab === "info" ? <ProfileForm /> : <PasswordForm />}
          </div>
        </main>
      </div>
    </div>
  );
}