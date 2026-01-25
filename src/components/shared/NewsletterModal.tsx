"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, Megaphone } from "lucide-react";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nickname: string) => Promise<void>;
  email: string;
}

export function NewsletterModal({ isOpen, onClose, onSubmit, email }: NewsletterModalProps) {
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(nickname);
      setNickname(""); // 成功後清空
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/5 backdrop-blur-sm"
          />

          {/* Modal 本體 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="bg-background relative overflow-hidden rounded-2xl border border-[var(--border)] shadow-2xl">
              {/* 標題區 */}
              <div className="flex items-center justify-between border-b border-[var(--border)] p-6">
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  <Mail className="text-primary h-5 w-5" />
                  訂閱電子報
                </h3>
                <button
                  onClick={onClose}
                  className="hover:bg-muted rounded-full p-2 transition-colors"
                >
                  <X className="h-5 w-5 opacity-70" />
                </button>
              </div>

              <div className="space-y-6 p-6">
                {/* 電子報須知 */}
                <div className="bg-muted/50 text-foreground/80 rounded-lg border border-[var(--border)] p-4 text-sm leading-relaxed">
                  {/* 修改處：將 emoji 換成 Megaphone icon 並調整排版 */}
                  <div className="text-foreground mb-2 flex items-center gap-2 font-semibold">
                    <Megaphone className="text-primary h-4 w-4" />
                    <span>訂閱須知：</span>
                  </div>

                  <ul className="list-inside list-disc space-y-1 pl-1 opacity-80">
                    <li>我們將不定期發送最新的技術文章。</li>
                    <li>您的信箱 ({email}) 僅用於發送本站資訊。</li>
                    <li>您可以隨時透過信件中的連結取消訂閱。</li>
                  </ul>
                </div>

                {/* 暱稱輸入框 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">請問該如何稱呼您？ (選填)</label>
                  <div className="relative">
                    <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="輸入您的暱稱"
                      className="bg-background focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-[var(--border)] py-2.5 pr-4 pl-10 text-sm transition-all outline-none focus:ring-2"
                    />
                  </div>
                </div>

                {/* 按鈕區 */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="hover:bg-muted flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition-colors"
                    disabled={isSubmitting}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-primary text-primary-foreground flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isSubmitting ? "處理中..." : "確認訂閱"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
