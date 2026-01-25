"use client";

import { User, KeyRound } from "lucide-react";
import { User as UserType } from "@/types";
import { AvatarUpload } from "./AvatarUpload";

interface Props {
  user: UserType | null;
  activeTab: string;
  onTabChange: (tab: "info" | "security") => void;
}

export function ProfileSidebar({ user, activeTab, onTabChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-[2rem] border border-base-200 p-10 text-center">
        <AvatarUpload />
        
        <h2 className="text-2xl font-black tracking-tight text-foreground">{user?.username}</h2>
        <p className="mt-1 text-sm text-foreground/50">{user?.email}</p>
      </div>

      <nav className="flex flex-col gap-2">
        <button
          onClick={() => onTabChange("info")}
          className={`flex items-center gap-4 rounded-2xl px-6 py-5 font-bold transition-all border-2 ${
            activeTab === "info" 
              ? "bg-primary border-primary text-primary-foreground" 
              : "bg-transparent border-transparent text-foreground/60 hover:bg-base-200"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="whitespace-nowrap">帳戶基本資訊</span>
        </button>
        <button
          onClick={() => onTabChange("security")}
          className={`flex items-center gap-4 rounded-2xl px-6 py-5 font-bold transition-all border-2 ${
            activeTab === "security" 
              ? "bg-primary border-primary text-primary-foreground" 
              : "bg-transparent border-transparent text-foreground/60 hover:bg-base-200"
          }`}
        >
          <KeyRound className="h-5 w-5" />
          <span className="whitespace-nowrap">修改登入密碼</span>
        </button>
      </nav>
    </div>
  );
}