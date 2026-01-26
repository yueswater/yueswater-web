"use client";

import { Github, Instagram, Facebook, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { NewsletterModal } from "@/components/shared/NewsletterModal";
import { newsletterService } from "@/services/newsletterService";
import { useToast } from "@/context/ToastContext";

export function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInitialSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsModalOpen(true);
  };

  const handleFinalSubscribe = async (nickname: string) => {
    try {
      await newsletterService.subscribe(email, nickname);
      showToast("訂閱成功！請至信箱收取歡迎信", "success");
      setIsModalOpen(false);
      setEmail("");
    } catch (error: any) {
      showToast(error.message || "訂閱失敗，請稍後再試", "error");
      throw error;
    }
  };

  return (
    <>
      <footer className="bg-background mt-auto w-full border-t border-[color:var(--border)] py-8 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="order-2 text-center md:order-1 md:text-left">
              <p className="text-foreground text-sm font-semibold">
                © {new Date().getFullYear()} 岳氏礦泉水
              </p>
              <p className="text-foreground/60 mt-0.5 text-xs">Powered by Django & Next.js</p>
            </div>

            <div className="order-1 flex w-full flex-col items-center gap-4 md:order-2 md:w-auto md:flex-row md:gap-6">
              <div className="flex items-center gap-2">
                <a
                  href="mailto:sungpunyue@gmail.com"
                  className="text-foreground/60 hover:bg-muted hover:text-primary rounded-full p-2 transition-all"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
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
    </>
  );
}