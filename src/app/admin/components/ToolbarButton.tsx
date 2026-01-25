import React from "react";

// 工具列按鈕組件屬性
interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  tooltip: string;
}

// 工具列按鈕組件
export function ToolbarButton({ onClick, icon, tooltip }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={tooltip}
      className="hover:bg-primary/10 hover:text-primary text-foreground/60 rounded p-2 transition-colors"
    >
      {icon}
    </button>
  );
}
