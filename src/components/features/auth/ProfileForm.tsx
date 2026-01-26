"use client";

import { useState } from "react";
import { User } from "@/types";
import { authService } from "@/services/authService";
import { useToast } from "@/context/ToastContext";

export function ProfileForm({ user }: { user: User | null }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(formData);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      showToast("個人資料更新成功", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      showToast("更新失敗：" + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full rounded-2xl border-2 border-base-200 bg-base-100 px-6 py-4 outline-none transition-all focus:border-primary focus:bg-card font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <label className="text-sm font-black text-foreground/60 ml-2">姓氏</label>
          <input
            type="text"
            className={inputStyle}
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            placeholder="尚未填寫"
          />
        </div>
        <div className="space-y-3">
          <label className="text-sm font-black text-foreground/60 ml-2">名字</label>
          <input
            type="text"
            className={inputStyle}
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            placeholder="尚未填寫"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-black text-foreground/60 ml-2">使用者名稱</label>
        <input
          type="text"
          className={`${inputStyle} cursor-not-allowed opacity-50`}
          value={formData.username}
          disabled
        />
        <p className="text-[10px] text-foreground/30 ml-2">目前使用者名稱無法修改</p>
      </div>

      <div className="flex justify-end pt-8">
        <button 
          type="submit" 
          className="btn btn-primary h-auto min-h-0 rounded-[1.25rem] px-14 py-4 text-base font-black border-none transition-all hover:scale-[1.03] active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? "處理中..." : "儲存並更新資料"}
        </button>
      </div>
    </form>
  );
}