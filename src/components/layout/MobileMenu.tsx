"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// 1. 引入 ThemeToggle
import { ThemeToggle } from "@/components/features/theme/ThemeToggle";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { name: string; href: string }[];
}

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const { user, logout } = useAuth();

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const listVariants: Variants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="bg-base-100/90 supports-[backdrop-filter]:bg-base-100/60 fixed inset-0 z-[60] flex flex-col backdrop-blur-xl"
        >
          {/* 2. 頂部功能區：改為左右對齊 (左邊主題切換，右邊關閉) */}
          <div className="border-base-content/5 flex items-center justify-between border-b p-6">
            <ThemeToggle />

            <button onClick={onClose} className="btn btn-ghost btn-circle" aria-label="關閉選單">
              <X className="text-base-content h-8 w-8" />
            </button>
          </div>

          {/* 中間導航連結 */}
          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {navItems.map((item, i) => (
              <motion.div key={item.name} custom={i} variants={listVariants}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="text-base-content hover:text-primary text-3xl font-bold tracking-widest transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* 底部使用者資訊 */}
          <div className="border-base-content/10 bg-base-200/50 border-t p-8 backdrop-blur-md">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="ring-primary ring-offset-base-100 h-12 w-12 rounded-full ring ring-offset-2">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          width={48}
                          height={48}
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="bg-primary text-primary-content flex h-full w-full items-center justify-center text-xl font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base-content text-lg font-bold">{user.username}</span>
                    <span className="text-base-content/60 text-sm">
                      {user.email || "尚無電子郵件"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout?.();
                    onClose();
                  }}
                  className="btn btn-ghost btn-circle text-error"
                  aria-label="登出"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="btn btn-primary w-full rounded-full text-lg"
              >
                <LogIn className="mr-2 h-5 w-5" />
                登入 / 註冊
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
