import { Post } from "@/types";
import Image from "next/image";
import { ArticleBody } from "@/components/features/posts/ArticleBody";
import { TableOfContents } from "@/components/features/posts/TableOfContents";
import { ClientArticleHeader } from "@/components/features/posts/ClientArticleHeader";
import { LikeSection } from "@/components/features/posts/LikeSection";
import { CommentSection } from "@/components/features/posts/CommentSection";
import { getFullImageUrl, processContentImages } from "@/utils/urlHelpers";

const API_URL = process.env.SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL;

async function getPost(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`${API_URL}/posts/${slug}/`, {
      cache: "no-store",
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Fetch failed", error);
    return null;
  }
}

async function recordView(slug: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/posts/${slug}/view/`, {
      method: "POST",
    });

    return response.ok;
  } catch (error) {
    console.error("View record failed", error);
    return false;
  }
}

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;

  const [post, viewRecorded] = await Promise.all([getPost(slug), recordView(slug)]);

  if (!post) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">404</h1>
        <p className="opacity-60">Post Not Found</p>
      </div>
    );
  }

  console.log("FINAL URL:", getFullImageUrl(post.cover_image))

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <article className="lg:col-span-3">
          <ClientArticleHeader post={post} />

          {post.cover_image && (
            <div className="mb-8 overflow-hidden rounded-lg">
              <Image
                src={getFullImageUrl(post.cover_image).replace("yueswater-server", "localhost")}
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

          <LikeSection
            postId={post.id}
            initialLikes={post.likes_count || 0}
            isLiked={post.is_liked || false}
          />

          <CommentSection postId={post.id} slug={post.slug} initialComments={post.comments || []} />
        </article>

        <aside className="lg:col-span-1">
          <TableOfContents content={post.content} />
        </aside>
      </div>
    </main>
  );
}