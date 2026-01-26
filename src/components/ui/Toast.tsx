"use client";

import { motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const iconMap = {
    success: <CheckCircle className="h-5 w-5 text-[#66cc8a]" />,
    error: <AlertCircle className="h-5 w-5 text-[#f82834]" />,
    info: <Info className="h-5 w-5 text-[#4ea0ff]" />,
  };

  const borderMap = {
    success: "border-none",
    error: "border-none",
    info: "border-none",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100 }}
      className={`pointer-events-auto flex items-center gap-3 rounded-xl border bg-base-100/80 backdrop-blur-md p-4 shadow-2xl min-w-[280px] max-w-sm ${borderMap[type]}`}
    >
      <div className="flex-shrink-0">
        {iconMap[type]}
      </div>
      
      <p className="flex-1 text-sm font-bold text-base-content/90">
        {message}
      </p>

      <button 
        onClick={onClose}
        className="text-base-content/40 hover:text-base-content/80 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}