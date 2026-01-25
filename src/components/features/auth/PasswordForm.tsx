"use client";

import { useState } from "react";
import { authService } from "@/services/authService";

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
      alert("新密碼與確認密碼不符");
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword(passwords);
      setPasswords({ old_password: "", new_password: "", confirm_password: "" });
      alert("密碼修改成功");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">當前密碼</label>
        <input
          type="password"
          className="input input-bordered w-full rounded-xl"
          required
          value={passwords.old_password}
          onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">新密碼</label>
        <input
          type="password"
          className="input input-bordered w-full rounded-xl"
          required
          value={passwords.new_password}
          onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">確認新密碼</label>
        <input
          type="password"
          className="input input-bordered w-full rounded-xl"
          required
          value={passwords.confirm_password}
          onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full rounded-xl md:w-fit md:px-10"
      >
        {loading ? "處理中..." : "修改密碼"}
      </button>
    </form>
  );
}