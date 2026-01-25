"use client";

import { useState } from "react";
import { authService } from "@/services/authService";
import { KeyRound, ShieldAlert } from "lucide-react";

export function PasswordForm() {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      alert("新密碼與確認新密碼不一致");
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword(passwords);
      setPasswords({ old_password: "", new_password: "", confirm_password: "" });
      alert("密碼已成功更新");
    } catch (err: any) {
      alert(err.message || "密碼更新失敗，請檢查舊密碼是否正確");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full rounded-2xl border-2 border-base-200 bg-base-100 px-6 py-4 outline-none transition-all focus:border-primary focus:bg-card font-medium placeholder:text-foreground/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 flex gap-3 items-start">
        <ShieldAlert className="h-5 w-5 text-yellow-600 mt-0.5" />
        <div className="text-sm text-yellow-700 font-medium">
          為了您的帳號安全，修改密碼後請務必妥善保存。建議使用英文字母、數字與符號的組合。
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-black text-foreground/60 ml-2">當前密碼</label>
        <div className="relative">
          <input
            type="password"
            className={inputStyle}
            required
            value={passwords.old_password}
            onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })}
            placeholder="請輸入目前的密碼"
          />
          <KeyRound className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <label className="text-sm font-black text-foreground/60 ml-2">新密碼</label>
          <input
            type="password"
            className={inputStyle}
            required
            value={passwords.new_password}
            onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
            placeholder="請輸入新密碼"
          />
        </div>
        <div className="space-y-3">
          <label className="text-sm font-black text-foreground/60 ml-2">確認新密碼</label>
          <input
            type="password"
            className={inputStyle}
            required
            value={passwords.confirm_password}
            onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
            placeholder="請再次輸入新密碼"
          />
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary h-auto min-h-0 rounded-[1.25rem] px-14 py-4 text-base font-black border-none transition-all hover:scale-[1.03] active:scale-[0.98]"
        >
          {loading ? "正在處理..." : "確認修改密碼"}
        </button>
      </div>
    </form>
  );
}