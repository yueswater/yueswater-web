"use client";

import { useState } from "react";
import { X, Plus, Search } from "lucide-react";

// 智能選擇器組件
interface SmartSelectorProps<T extends { id: number; name: string }> {
  items: T[];
  selectedItems: T[];
  onSelect: (item: T) => void;
  onRemove: (id: number) => void;
  onCreate: (name: string) => void;
  placeholder: string;
  limit?: number;
}

// 智能選擇器組件
export function SmartSelector<T extends { id: number; name: string }>({
  items,
  selectedItems,
  onSelect,
  onRemove,
  onCreate,
  placeholder,
  limit,
}: SmartSelectorProps<T>) {
  // State 管理
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const isLimitReached = limit ? selectedItems.length >= limit : false;

  // 過濾項目
  const filteredItems = items.filter(
    (item) =>
      !selectedItems.find((selected) => selected.id === item.id) &&
      item.name.toLowerCase().includes(query.toLowerCase())
  );

  // 精確匹配檢查
  const exactMatch = items.find((item) => item.name.toLowerCase() === query.toLowerCase());

  return (
    <div className="relative">
      {/* 已選擇的項目區域 */}
      <div className="mb-2 flex flex-wrap gap-2">
        {selectedItems.map((item, index) => (
          <span
            key={`selected-${item.id || "new"}-${index}`}
            className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium"
          >
            {item.name}
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      {!isLimitReached ? (
        <div className="relative">
          <Search className="text-foreground/40 absolute top-2.5 left-2.5 h-4 w-4" />
          <input
            type="text"
            className="bg-card/50 focus:border-primary focus:ring-primary w-full rounded-lg py-2 pr-4 pl-9 text-sm transition-all outline-none focus:ring-1"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          />
          {isOpen && query && (
            <div className="bg-card animate-in fade-in zoom-in absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-[color:var(--border)] shadow-lg duration-200">
              <ul className="max-h-48 overflow-y-auto py-1">
                {filteredItems.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="hover:bg-primary/5 hover:text-primary group flex w-full items-center justify-between px-4 py-2 text-left text-sm"
                      onClick={() => {
                        onSelect(item);
                        setQuery("");
                      }}
                    >
                      <span>{item.name}</span>
                      <Plus className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  </li>
                ))}

                {!exactMatch && query.trim() !== "" && (
                  <li className="border-t border-[color:var(--border)]">
                    <button
                      type="button"
                      className="text-primary hover:bg-primary/10 flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium"
                      onClick={() => {
                        onCreate(query.trim());
                        setQuery("");
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      建立新項目："{query}"
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-foreground/40 rounded-lg border border-dashed border-[color:var(--border)] p-2 text-center text-xs">
          {limit === 1 ? "若要更換分類，請先移除目前的分類" : `已達到標籤上限 (${limit} 個)`}
        </div>
      )}
    </div>
  );
}
