"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Settings2, Loader2, BadgeCheck, Ban } from "lucide-react";
import { ProfileSidebar } from "@/components/features/auth/ProfileSidebar";
import { ProfileForm } from "@/components/features/auth/ProfileForm";
import { PasswordForm } from "@/components/features/auth/PasswordForm";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "security">("info");

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <ProfileSidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} />
        </aside>

        <main className="lg:col-span-8">
          <div className="bg-card min-h-[600px] rounded-[2.5rem] border border-base-200 p-8 shadow-sm md:p-12">
            <div className="mb-10 flex items-center justify-between border-b border-base-200 pb-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-2xl p-3 text-primary">
                  <Settings2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{activeTab === "info" ? "帳戶資訊" : "安全設定"}</h3>
                  <p className="text-sm text-foreground/50">管理您的個人資料</p>
                </div>
              </div>

              <div className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest ${
                user?.is_active 
                  ? "bg-green-500/10 text-green-600" 
                  : "bg-red-500/10 text-red-600"
              }`}>
                {user?.is_active ? (
                  <>帳號已驗證 <BadgeCheck className="h-4 w-4" /></>
                ) : (
                  <>尚未驗證 <Ban className="h-4 w-4" /></>
                )}
              </div>
            </div>

            {activeTab === "info" ? <ProfileForm user={user} /> : <PasswordForm />}
          </div>
        </main>
      </div>
    </div>
  );
}