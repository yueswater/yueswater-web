"use client";

import { useState } from "react";
import { Share2, Link as LinkIcon, MessageCircle, Facebook } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ShareSection() {
  const [isHovered, setIsHovered] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("連結已複製到剪貼簿");
  };

  const shareToLine = () => {
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank", "width=600,height=400");
  };

  return (
    <div 
      className="flex flex-col items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-center justify-center h-16 w-64">
        <AnimatePresence mode="wait">
          {!isHovered ? (
            <motion.div
              key="share-main"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-base-content/20 bg-base-100 text-base-content/50 transition-colors hover:border-primary hover:text-primary"
            >
              <Share2 className="h-7 w-7" />
            </motion.div>
          ) : (
            <motion.div
              key="share-options"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-6"
            >
              <motion.button
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={shareToFacebook}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-lg"
              >
                <Facebook className="h-6 w-6 fill-current" />
              </motion.button>

              <motion.button
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={shareToLine}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#06C755] text-white shadow-lg"
              >
                <MessageCircle className="h-6 w-6 fill-current" />
              </motion.button>

              <motion.button
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyLink}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-base-300 text-base-content shadow-lg"
              >
                <LinkIcon className="h-6 w-6" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-base-content/30">
        分享文章
      </span>
    </div>
  );
}