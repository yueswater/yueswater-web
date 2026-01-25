"use client";

import { useState, useRef } from "react";
import { Check, Copy, Terminal } from "lucide-react";

export function CodeBlock({ children, ...props }: any) {
  // 複製狀態
  const [isCopied, setIsCopied] = useState(false);
  // 參考 pre 元素
  const preRef = useRef<HTMLPreElement>(null);
  // 從 children 中提取語言類別
  const codeElement = children as any;
  // 取得 className 屬性
  const className = codeElement?.props?.className || "";
  // 解析語言名稱
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  // 複製程式碼處理函式
  const handleCopy = async () => {
    if (!preRef.current) return;
    // 取得要複製的文字s
    const textToCopy = preRef.current.innerText;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("複製失敗", err);
    }
  };

  // 組件渲染
  return (
    <div className="not-prose group my-6 w-full overflow-hidden rounded-lg border border-[color:var(--border)] bg-[#2e3440] shadow-sm">
      {/* 頂部標題列 */}
      <div className="flex items-center justify-between border-b border-white/5 bg-[#3b4252] px-4 py-2">
        {/* 左側 顯示語言 */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
          <Terminal className="h-3.5 w-3.5 opacity-50" />
          <span className="tracking-wider uppercase">{language || "TEXT"}</span>
        </div>

        {/* 右側 複製按鈕 */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-white"
          title="複製程式碼"
        >
          {isCopied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-400" />
              <span className="text-green-400">已複製</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>複製</span>
            </>
          )}
        </button>
      </div>

      {/* 程式碼區域 */}
      <pre
        ref={preRef}
        {...props}
        className="!m-0 overflow-x-auto !bg-transparent !p-4 font-mono text-sm leading-relaxed"
      >
        {children}
      </pre>
    </div>
  );
}
