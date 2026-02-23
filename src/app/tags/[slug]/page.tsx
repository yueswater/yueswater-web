import { postService } from "@/services/postService";
import Link from "next/link";
import { User, Calendar, RefreshCw, Tag as TagIcon } from "lucide-react";

interface TagDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function TagDetailPage({ params, searchParams }: TagDetailPageProps) {
  const { slug } = await params;
  const decodedTagName = decodeURIComponent(slug);
  const { page = "1" } = await searchParams;
  const currentPage = parseInt(page);
  const pageSize = 5;

  const allPosts = await postService.getPublishedPosts();

  const filteredPosts = allPosts.filter((post) =>
    post.tags?.some((tag) => tag.name === decodedTagName)
  );

  const totalCount = filteredPosts.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const currentPosts = filteredPosts.slice(start, end);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 border-b border-base-200 pb-6">
          <div className="flex items-center gap-2 text-sm opacity-50 mb-2">
            <Link href="/tags" className="hover:text-primary">Tags</Link>
            <span>/</span>
          </div>
          <h1 className="text-3xl font-bold italic">#{decodedTagName}</h1>
          <p className="mt-2 text-sm opacity-60">共找到 {totalCount} 篇文章</p>
        </header>
        
        <div className="flex flex-col gap-8">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <div key={post.id} className="group border-b border-base-200 pb-8 last:border-0">
                <Link href={`/posts/${post.slug}`} className="block">
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm opacity-60">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{post.author?.username || "yueswater"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{post.created_at?.split('T')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RefreshCw size={14} />
                      <span>{post.updated_at?.split('T')[0]}</span>
                    </div>
                    {post.category && (
                      <div className="flex items-center gap-1">
                        <TagIcon size={14} />
                        <span>{post.category.name}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="py-20 text-center opacity-30">
              目前沒有標記為此標籤的文章
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            {currentPage > 1 ? (
              <Link href={`/tags/${slug}?page=${currentPage - 1}`} className="btn btn-sm btn-outline">
                上一頁
              </Link>
            ) : (
              <button className="btn btn-sm btn-disabled" disabled>上一頁</button>
            )}
            
            <span className="text-xs font-mono">
              PAGE {currentPage} / {totalPages}
            </span>
            
            {currentPage < totalPages ? (
              <Link href={`/tags/${slug}?page=${currentPage + 1}`} className="btn btn-sm btn-outline">
                下一頁
              </Link>
            ) : (
              <button className="btn btn-sm btn-disabled" disabled>下一頁</button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}