"use client";

import { useState } from "react";
import { Send, User as LucideUser, Pencil, Trash2, X, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Comment as PostComment } from "@/types";
import { postService } from "@/services/postService";

interface CommentSectionProps {
  postId: number;
  slug: string;
  initialComments?: PostComment[];
}

export function CommentSection({ postId, slug, initialComments = [] }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<PostComment[]>(initialComments);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 編輯狀態管理
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user || !postId) return;

    setIsSubmitting(true);
    try {
      const newComment = await postService.createComment(postId, content);
      setComments((prev) => [newComment, ...prev]);
      setContent("");
    } catch (error: any) {
      alert(error.message || "留言發送失敗");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("確定要刪除這條留言嗎？")) return;
    try {
      await postService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleUpdate = async (commentId: number) => {
    if (!editContent.trim()) return;
    try {
      const updatedComment = await postService.updateComment(commentId, editContent);
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updatedComment : c))
      );
      setEditingId(null);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const startEditing = (comment: PostComment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  return (
    <div className="mx-auto w-full max-w-3xl border-t border-[color:var(--border)] pt-8">
      <h3 className="text-base-content mb-8 text-xl font-bold">留言 ({comments.length})</h3>

      {/* 留言輸入框 */}
      <div className="mb-10">
        {user ? (
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
              <span className="text-primary text-lg font-bold">
                {user.username?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="寫下你的想法..."
                className="bg-base-200/50 focus:ring-primary/20 focus:border-primary text-base-content placeholder:text-base-content/40 min-h-[100px] w-full resize-y rounded-xl border border-[color:var(--border)] p-4 transition-all focus:ring-2 focus:outline-none"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="bg-primary text-primary-content flex items-center gap-2 rounded-lg px-6 py-2 font-medium transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "傳送中..." : <><Send className="h-4 w-4" /> 發送留言</>}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-base-200/30 rounded-xl border border-dashed border-[color:var(--border)] p-6 text-center">
            <p className="text-base-content/60 mb-2">登入後即可參與討論</p>
            <a href={`/login?redirect=/posts/${slug}`} className="text-primary font-medium hover:underline">前往登入</a>
          </div>
        )}
      </div>

      {/* 留言列表 */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="group flex gap-4">
              <div className="bg-base-200 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[color:var(--border)]">
                <LucideUser className="text-base-content/50 h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base-content font-semibold">{comment.user.username}</span>
                    <span className="text-base-content/40 text-xs">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {/* 操作按鈕：僅本人可見 */}
                  {user?.id === comment.user.id && (
                    <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button 
                        onClick={() => startEditing(comment)}
                        className="text-base-content/40 hover:text-primary p-1 transition-colors"
                        title="編輯留言"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="text-base-content/40 hover:text-error p-1 transition-colors"
                        title="刪除留言"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {editingId === comment.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="bg-base-200 focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-[color:var(--border)] p-3 focus:ring-2 focus:outline-none"
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button 
                        onClick={() => setEditingId(null)}
                        className="btn btn-ghost btn-sm"
                      >
                        <X className="h-4 w-4" /> 取消
                      </button>
                      <button 
                        onClick={() => handleUpdate(comment.id)}
                        className="btn btn-primary btn-sm"
                      >
                        <Check className="h-4 w-4" /> 儲存
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-base-content/80 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-base-content/40 py-10 text-center">目前還沒有留言</div>
        )}
      </div>
    </div>
  );
}