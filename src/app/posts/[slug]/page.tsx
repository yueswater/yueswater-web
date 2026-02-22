import { Post } from "@/types";
import Image from "next/image";
import { ArticleBody } from "@/components/features/posts/ArticleBody";
import { TableOfContents } from "@/components/features/posts/TableOfContents";
import { ClientArticleHeader } from "@/components/features/posts/ClientArticleHeader";
import { LikeSection } from "@/components/features/posts/LikeSection";
import { BookmarkSection } from "@/components/features/posts/BookmarkSection";
import { ShareSection } from "@/components/features/posts/ShareSection";
import { CommentSection } from "@/components/features/posts/CommentSection";
import { BuyMeCoffee } from "@/components/features/posts/BuyMeCoffee";
import { getFullImageUrl, processContentImages } from "@/utils/urlHelpers";

const API_URL = (process.env.SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api").replace(/\/$/, "");

async function getPost(slug: string): Promise<Post | null> {
  try {
    const url = `${API_URL}/posts/${slug}/`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    return null;
  }
}

async function recordView(slug: string): Promise<boolean> {
  try {
    const url = `${API_URL}/posts/${slug}/view/`;
    const response = await fetch(url, { method: "POST" });
    return response.ok;
  } catch (error) {
    return false;
  }
}

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "文章不存在" };

  const shareDescription = "嘿！看看我在岳世界找到的好文章，一起來看看吧！";

  return {
    title: post.title,
    description: shareDescription,
    openGraph: {
      title: post.title,
      description: shareDescription,
      url: `https://yueswater.com/posts/${slug}`,
      images: [getFullImageUrl(post.cover_image)],
      type: "article",
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const [post] = await Promise.all([getPost(slug), recordView(slug)]);

  if (!post) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">404</h1>
        <p className="opacity-60">文章不存在</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <article className="lg:col-span-3">
          <ClientArticleHeader post={post} />

          {post.cover_image && (
            <div className="mb-8 overflow-hidden">
              <Image
                src={getFullImageUrl(post.cover_image)}
                alt={post.title}
                width={800}
                height={400}
                className="h-auto w-full object-cover"
                unoptimized
                priority
              />
            </div>
          )}

          <div id="post-content">
            <ArticleBody content={processContentImages(post.content)} />
          </div>

          <div className="mb-6 mt-12 border-y border-base-200 py-16">
            <div className="flex flex-row items-start justify-center">
              <div className="w-1/3 flex justify-center">
                <LikeSection
                  postId={post.id}
                  initialLikes={post.likes_count || 0}
                  isLiked={post.is_liked || false}
                />
              </div>

              <div className="w-1/3 flex justify-center">
                <ShareSection title={post.title} />
              </div>

              <div className="w-1/3 flex justify-center">
                <BookmarkSection postId={post.id} />
              </div>
            </div>
          </div>

          <div className="mb-12">
            <BuyMeCoffee />
          </div>

          <CommentSection postId={post.id} slug={post.slug} initialComments={post.comments || []} />
        </article>

        <aside className="lg:col-span-1">
          <TableOfContents content={post.content} />
        </aside>
      </div>
    </main>
  );
}