"use client";

import { useEffect, useState, useRef } from "react";
import { Search, FileText, ChevronRight, Loader2, Command } from "lucide-react";
import { postService } from "@/services/postService";
import { Post } from "@/types";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function SearchModal({ isOpen, onClose, triggerRef }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2 - window.innerWidth / 2;
      const y = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOrigin({ x, y });
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);

      const fetchPosts = async () => {
        if (allPosts.length > 0) return;
        setLoading(true);
        try {
          const data = await postService.getPublishedPosts();
          setAllPosts(data);
        } catch (error) {
          console.error("搜尋資料載入失敗", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim() || allPosts.length === 0) {
      setResults([]);
      return;
    }

    const fuse = new Fuse(allPosts, {
      keys: [
        { name: "title", weight: 0.7 },
        { name: "categories.name", weight: 0.3 },
        { name: "excerpt", weight: 0.2 },
      ],
      threshold: 0.4,
      includeScore: true,
    });

    const searchResults = fuse.search(query);
    setResults(searchResults.map((result) => result.item).slice(0, 5));
  }, [query, allPosts]);

  const handleSelect = (slug: string) => {
    router.push(`/posts/${slug}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-base-content/10 absolute inset-0 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.1,
              x: origin.x,
              y: origin.y,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.1,
              x: origin.x,
              y: origin.y,
            }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="bg-base-100/80 relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-[0_0_50px_-12px_rgb(0_0_0_/_0.25)] backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center gap-2 px-4 py-5 md:gap-4 md:px-6">
              <Search className="text-base-content/40 h-5 w-5 shrink-0 md:h-6 md:w-6" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜尋文章..."
                className="placeholder:text-base-content/30 text-base-content min-w-0 flex-1 bg-transparent text-lg font-medium outline-none md:text-xl"
              />

              <div className="bg-base-200/50 border-base-content/5 text-base-content/50 hidden shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium md:flex">
                <Command className="h-3 w-3" />
                <span>ESC</span>
              </div>

              <button 
                onClick={onClose} 
                className="text-base-content/50 shrink-0 whitespace-nowrap px-2 text-sm font-medium md:hidden"
              >
                取消
              </button>

              {(query || results.length > 0) && (
                <div className="bg-base-content/5 absolute right-4 bottom-0 left-4 h-[1px] md:right-6 md:left-6" />
              )}
            </div>

            <div className="custom-scrollbar max-h-[60vh] overflow-y-auto">
              {loading && query.length > 0 && results.length === 0 ? (
                <div className="text-base-content/40 flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin opacity-50" />
                </div>
              ) : query && results.length === 0 && !loading ? (
                <div className="text-base-content/50 flex flex-col items-center gap-3 py-16 text-center">
                  <Search className="h-10 w-10 opacity-20" />
                  <p className="text-lg font-medium">找不到相關文章</p>
                  <p className="text-sm opacity-60">試試其他關鍵字？</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1 p-2 md:p-3">
                  {results.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handleSelect(post.slug)}
                      className="group hover:bg-base-content/5 dark:hover:bg-base-content/10 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 md:gap-4 md:px-4 md:py-3"
                    >
                      <FileText className="text-base-content/40 group-hover:text-primary h-5 w-5 shrink-0 transition-colors" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base-content group-hover:text-primary truncate text-base leading-tight font-semibold transition-colors md:text-lg">
                          {post.title}
                        </h4>
                        <div className="text-base-content/50 mt-1 flex items-center gap-2 text-xs md:text-sm">
                          <span className="max-w-[120px] truncate md:max-w-[200px]">
                            {post.category?.name || "未分類"}
                          </span>
                          <span className="opacity-50">·</span>
                          <span className="truncate opacity-70">
                            {post.excerpt ? post.excerpt.substring(0, 30) + "..." : "查看詳情"}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="text-base-content/20 group-hover:text-primary h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 md:h-5 md:w-5" />
                    </div>
                  ))}
                </div>
              )}

              {!query && results.length === 0 && !loading && (
                <div className="text-base-content/40 flex flex-col items-center gap-2 py-16 text-center opacity-70">
                  <Command className="h-8 w-8 opacity-20" />
                  <p className="text-sm">輸入關鍵字開始搜尋...</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}