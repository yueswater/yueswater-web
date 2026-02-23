import { postService } from "@/services/postService";
import Link from "next/link";
import { User, Calendar, RefreshCw, Tag as TagIcon } from "lucide-react";

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryDetailPage({ params, searchParams }: CategoryDetailPageProps) {
  const { slug } = await params;
  const decodedCategoryName = decodeURIComponent(slug);
  const { page = "1" } = await searchParams;
  const currentPage = parseInt(page);
  const pageSize = 5;

  const allPosts = await postService.getPublishedPosts();

  const filteredPosts = allPosts.filter((post) =>
    post.category?.name === decodedCategoryName
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
            <Link href="/categories" className="hover:text-primary">Categories</Link>
            <span>/</span>
          </div>
          <h1 className="text-3xl font-bold">分類：{decodedCategoryName}</h1>
          <p className="mt-2 text-sm opacity-60">此分類共有 {totalCount} 篇文章</p>
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
                    <div className="flex items-center gap-1">
                      <TagIcon size={14} />
                      <span>{post.category?.name}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="py-24 text-center border-2 border-dashed border-base-200 rounded-2xl">
              <p className="text-xl opacity-30">目前此分類下還沒有文章喔！</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-6">
            {currentPage > 1 ? (
              <Link 
                href={`/categories/${slug}?page=${currentPage - 1}`} 
                className="px-6 py-2 bg-base-200 rounded-full hover:bg-base-300 transition-all text-sm font-medium"
              >
                上一頁
              </Link>
            ) : (
              <span className="px-6 py-2 opacity-20 text-sm">上一頁</span>
            )}
            
            <span className="text-sm font-semibold">
              {currentPage} / {totalPages}
            </span>
            
            {currentPage < totalPages ? (
              <Link 
                href={`/categories/${slug}?page=${currentPage + 1}`} 
                className="px-6 py-2 bg-base-200 rounded-full hover:bg-base-300 transition-all text-sm font-medium"
              >
                下一頁
              </Link>
            ) : (
              <span className="px-6 py-2 opacity-20 text-sm">下一頁</span>
            )}
          </div>
        )}
      </div>
    </main>
  );
}