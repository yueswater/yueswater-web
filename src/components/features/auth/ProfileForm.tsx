"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";

export function ProfileForm() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile({
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="form-control">
          <label className="label text-sm font-bold">姓氏</label>
          <input
            type="text"
            className="input input-bordered rounded-xl bg-base-200/50"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            placeholder="請輸入姓氏"
          />
        </div>
        <div className="form-control">
          <label className="label text-sm font-bold">名字</label>
          <input
            type="text"
            className="input input-bordered rounded-xl bg-base-200/50"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            placeholder="請輸入名字"
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label text-sm font-bold">使用者名稱</label>
        <input
          type="text"
          className="input input-bordered rounded-xl bg-base-200/50"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
      </div>

      <div className="form-control">
        <label className="label text-sm font-bold">電子郵件</label>
        <input
          type="email"
          className="input input-bordered rounded-xl opacity-60"
          value={formData.email}
          disabled
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className={`btn btn-primary rounded-xl px-8 ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          儲存設定
        </button>
      </div>
    </form>
  );
}