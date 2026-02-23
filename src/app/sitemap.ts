import { MetadataRoute } from 'next';
import { postService } from '@/services/postService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yueswater.com';
  
  const posts = await postService.getPublishedPosts();
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.updated_at),
  }));

  const categories = await postService.getCategories();
  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/categories/${encodeURIComponent(cat.name)}`,
    lastModified: new Date(),
  }));

  const tags = await postService.getTags();
  const tagUrls = tags.map((tag) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tag.name)}`,
    lastModified: new Date(),
  }));

  const staticPages = [
    '',
    '/about',
    '/categories',
    '/tags',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...postUrls, ...categoryUrls, ...tagUrls];
}