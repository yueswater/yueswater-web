"use client";

import { Github, Instagram, Facebook, ArrowRight, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { NewsletterModal } from "@/components/shared/NewsletterModal";
import { newsletterService } from "@/services/newsletterService";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 第一步：使用者在 Footer 輸入 Email 按下 Enter
  const handleInitialSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsModalOpen(true);
  };

  // 第二步：使用者在 Modal 確認並送出 (包含暱稱)
  const handleFinalSubscribe = async (nickname: string) => {
    try {
      await newsletterService.subscribe(email, nickname);
      alert("訂閱成功！請至信箱收取歡迎信。");
      setIsModalOpen(false);
      setEmail("");
    } catch (error: any) {
      alert(error.message || "訂閱失敗，請稍後再試。");
      throw error; // 拋出錯誤讓 Modal 處理 loading 狀態
    }
  };

  return (
    <>
      <footer className="bg-background mt-auto w-full border-t border-[color:var(--border)] py-8 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* 左側：版權資訊 */}
            <div className="order-2 text-center md:order-1 md:text-left">
              <p className="text-foreground text-sm font-semibold">
                © {new Date().getFullYear()} 岳氏礦泉水
              </p>
              <p className="text-foreground/60 mt-0.5 text-xs">Powered by Django & Next.js</p>
            </div>

            {/* 右側區塊：訂閱 + 社群 (水平排列) */}
            <div className="order-1 flex w-full flex-col items-center gap-4 md:order-2 md:w-auto md:flex-row md:gap-6">
              {/* 訂閱輸入框 (包含 Mail Icon) */}
              <form onSubmit={handleInitialSubmit} className="relative w-full md:w-72">
                {/* 左側 Mail Icon */}
                <Mail className="text-muted-foreground/70 pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="訂閱電子報..."
                  className="bg-muted/50 border-border focus:ring-primary/50 placeholder:text-muted-foreground/70 w-full rounded-full border py-2 pr-10 pl-10 text-sm transition-all focus:ring-1 focus:outline-none"
                  required
                />

                {/* 右側送出按鈕 */}
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground absolute top-1 right-1 bottom-1 flex aspect-square items-center justify-center rounded-full transition-opacity hover:opacity-90"
                  aria-label="訂閱"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* 直線分隔 (電腦版顯示) */}
              <div className="bg-border hidden h-6 w-px md:block" />

              {/* 社群連結 */}
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/yueswater"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground/60 hover:bg-muted hover:text-primary rounded-full p-2 transition-all"
                  aria-label="Github"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com/yueswater"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground/60 hover:bg-muted hover:text-primary rounded-full p-2 transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com/yues_19_water"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground/60 hover:bg-muted hover:text-primary rounded-full p-2 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 訂閱確認 Modal */}
      <NewsletterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFinalSubscribe}
        email={email}
      />
    </>
  );
}
