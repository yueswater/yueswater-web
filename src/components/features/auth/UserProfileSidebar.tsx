"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "motion/react";

interface UserProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileSidebar({ isOpen, onClose }: UserProfileSidebarProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {user && isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-background/20 fixed inset-0 z-40 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="scrollbar-hide fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-full max-w-xs overflow-y-auto bg-transparent p-6 pt-16 pb-5"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            <div className="flex h-full flex-col">
              <div className="mb-8 flex flex-col items-end space-y-6">
                <motion.button
                  onClick={onClose}
                  className="hover:bg-primary/10 text-foreground/60 hover:text-primary rounded-full p-1 transition-colors outline-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <X className="h-6 w-6" />
                </motion.button>

                <motion.div
                  className="space-y-1 text-right"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-foreground text-xl font-bold tracking-tight">
                    {user?.username || "用戶"}
                  </p>
                  <p className="text-foreground/50 text-sm font-medium">{user?.email || ""}</p>
                </motion.div>
              </div>

              <nav className="flex flex-1 flex-col items-end space-y-2">
                {[
                  { label: "個人檔案", href: "/profile", delay: 0.3 },
                  { label: "收藏文章", href: "/favorites", delay: 0.35 },
                ].map((item) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: item.delay, type: "spring" }}
                    className="w-full"
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="text-foreground/70 hover:text-primary hover:bg-primary/5 block w-full rounded-xl px-4 py-2 text-right text-lg font-medium transition-all outline-none"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-auto w-full pt-6"
              >
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl px-4 py-2 text-right font-bold text-red-500/80 transition-all outline-none hover:bg-red-500/5 hover:text-red-600"
                >
                  登出
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}