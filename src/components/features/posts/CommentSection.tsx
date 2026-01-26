"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, Pencil, Trash2, X, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Comment as PostComment } from "@/types";
import { postService } from "@/services/postService";

interface CommentSectionProps {
  postId: number;
  slug: string;
  initialComments?: PostComment[];
}

export function CommentSection({ postId, slug, initialComments = [] }: CommentSectionProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [comments, setComments] = useState<PostComment[]>(initialComments);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      showToast("留言發送成功", "success");
    } catch (error: any) {
      showToast(error.message || "留言發送失敗", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("確定要刪除這條留言嗎？")) return;
    try {
      await postService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      showToast("留言已刪除", "success");
    } catch (error: any) {
      showToast(error.message || "刪除失敗", "error");
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
      showToast("留言更新成功", "success");
    } catch (error: any) {
      showToast(error.message || "更新失敗", "error");
    }
  };

  const startEditing = (comment: PostComment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  return (
    <div className="mx-auto w-full max-w-3xl border-t border-base-200 pt-8">
      <h3 className="mb-8 text-xl font-bold">留言 ({comments.length})</h3>

      <div className="mb-10">
        {user ? (
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-base-200">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.username}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-lg font-black">
                  {user.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="寫下你的想法..."
                className="bg-base-200/50 focus:ring-primary/20 focus:border-primary placeholder:text-base-content/40 min-h-[100px] w-full resize-y rounded-xl border border-base-200 p-4 transition-all focus:ring-2 focus:outline-none"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="bg-primary text-primary-content flex items-center gap-2 rounded-lg px-6 py-2 font-black transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 shadow-none border-none"
                >
                  {isSubmitting ? "傳送中..." : <><Send className="h-4 w-4" /> 發送留言</>}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-base-200/30 rounded-xl border border-dashed border-base-200 p-6 text-center">
            <p className="text-base-content/60 mb-2">登入後即可參與討論</p>
            <a href={`/login?redirect=/posts/${slug}`} className="text-primary font-bold hover:underline">前往登入</a>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="group flex gap-4">
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-base-200">
                {comment.user.avatar ? (
                  <Image
                    src={comment.user.avatar}
                    alt={comment.user.username}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="bg-base-200 text-base-content/40 flex h-full w-full items-center justify-center text-lg font-black">
                    {comment.user.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{comment.user.username}</span>
                    <span className="text-base-content/40 text-xs">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {user?.id === comment.user.id && (
                    <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button 
                        onClick={() => startEditing(comment)}
                        className="text-base-content/40 hover:text-primary p-1 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="text-base-content/40 hover:text-error p-1 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {editingId === comment.id ? (
                  <div className="mt-2 flex flex-col gap-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="bg-base-200 focus:ring-primary/20 focus:border-primary w-full rounded-xl border border-base-200 p-3 focus:ring-2 focus:outline-none min-h-[80px]"
                    />
                    <div className="flex justify-end items-center gap-3">
                      <button 
                        onClick={() => setEditingId(null)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-base-content/60 font-bold hover:bg-base-200 transition-colors text-sm"
                      >
                        <X className="h-3.5 w-3.5" /> 取消
                      </button>
                      <button 
                        onClick={() => handleUpdate(comment.id)}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-primary-content font-black hover:opacity-90 transition-opacity text-sm shadow-none border-none"
                      >
                        <Check className="h-3.5 w-3.5" /> 儲存修改
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