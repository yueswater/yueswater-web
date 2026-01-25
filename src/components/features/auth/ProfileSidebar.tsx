"use client";

import Image from "next/image";
import { Camera, User, KeyRound } from "lucide-react";
import { User as UserType } from "@/types";

interface Props {
  user: UserType | null;
  activeTab: string;
  onTabChange: (tab: "info" | "security") => void;
}

export function ProfileSidebar({ user, activeTab, onTabChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-[2rem] border border-base-200 p-10 text-center">
        <div className="relative mx-auto mb-6 h-36 w-36">
          <div className="h-full w-full overflow-hidden rounded-full ring-8 ring-base-100">
            {user?.avatar ? (
              <Image src={user.avatar} alt="頭像" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-5xl font-black text-primary">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <label className="btn btn-primary btn-circle btn-sm absolute bottom-1 right-1 cursor-pointer border-none">
            <Camera className="h-4 w-4" />
            <input type="file" className="hidden" accept="image/*" />
          </label>
        </div>
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