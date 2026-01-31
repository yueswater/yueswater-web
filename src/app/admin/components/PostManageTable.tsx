"use client";

import { Post } from "@/types";
import { Edit, Eye, Archive, Send, FileText } from "lucide-react";
import Link from "next/link";

interface PostManageTableProps {
  posts: Post[];
  onToggleStatus: (slug: string, type: "draft" | "publish" | "archive") => Promise<void>;
}

export function PostManageTable({ posts, onToggleStatus }: PostManageTableProps) {
  const truncateTitle = (title: string) => {
    return title.length > 15 ? title.substring(0, 15) + "..." : title;
  };

  return (
    <div className="bg-card overflow-hidden rounded-xl border border-[color:var(--border)] shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-[color:var(--border)] text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">標題與 Slug</th>
              <th className="px-6 py-4">分類與標籤</th>
              <th className="px-6 py-4 text-center">狀態</th>
              <th className="px-6 py-4 text-right">管理操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border)]">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold">{truncateTitle(post.title)}</div>
                  <div className="text-foreground/40 font-mono text-xs">{post.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-bold">
                      {post.category?.name || "未分類"}
                    </span>
                    {post.tags?.map((tag: any) => (
                      <span key={tag.id} className="bg-secondary rounded px-1.5 py-0.5 text-[10px]">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    {post.is_published && (
                      <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-500">
                        已發布
                      </span>
                    )}
                    {post.is_draft && (
                      <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-500">
                        草稿
                      </span>
                    )}
                    {post.is_archived && (
                      <span className="inline-flex items-center rounded-full bg-zinc-500/10 px-2 py-0.5 text-[10px] font-bold text-zinc-500">
                        已封存
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/posts/${post.slug}`} target="_blank" title="查看文章">
                      <Eye className="text-foreground/40 hover:text-primary h-4 w-4 transition-colors" />
                    </Link>
                    <Link href={`/admin/write?edit=${post.slug}`} title="編輯內容">
                      <Edit className="text-foreground/40 hover:text-primary h-4 w-4 transition-colors" />
                    </Link>
                    <div className="mx-1 h-4 w-px bg-[color:var(--border)]" />
                    <button
                      onClick={() => onToggleStatus(post.slug, "publish")}
                      disabled={post.is_published}
                      className={`transition-colors ${post.is_published ? "text-primary opacity-100" : "text-foreground/20 hover:text-primary"}`}
                      title="切換為發布"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(post.slug, "draft")}
                      disabled={post.is_draft}
                      className={`transition-colors ${post.is_draft ? "text-yellow-500 opacity-100" : "text-foreground/20 hover:text-yellow-500"}`}
                      title="切換為草稿"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(post.slug, "archive")}
                      disabled={post.is_archived}
                      className={`transition-colors ${post.is_archived ? "text-zinc-500 opacity-100" : "text-foreground/20 hover:text-zinc-500"}`}
                      title="切換為封存"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {posts.length === 0 && (
        <div className="text-foreground/40 py-20 text-center text-sm">
          目前沒有任何文章。
        </div>
      )}
    </div>
  );
}