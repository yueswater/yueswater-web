"use client";

import React from "react";
import { Coffee } from "lucide-react";

export function BuyMeCoffee() {
  const bmcUrl = "https://www.buymeacoffee.com/yueswater";

  return (
    <a
      href={bmcUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full items-center justify-between rounded-full bg-[#FFDD00]/10 p-4 transition-all hover:bg-[#FFDD00]/20 border border-[#FFDD00]/20"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFDD00] text-black shadow-sm transition-transform group-hover:rotate-12">
          <Coffee className="h-6 w-6" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-bold text-base-content uppercase tracking-tight">
            喜歡這篇文章嗎？
          </span>
          <span className="text-xs text-base-content/60">
            點擊這裡請我喝杯咖啡，支持我的創作吧！
          </span>
        </div>
      </div>
      <div className="rounded-lg bg-[#FFDD00] px-3 py-1 text-[10px] font-black uppercase text-black">
        贊助支持
      </div>
    </a>
  );
}