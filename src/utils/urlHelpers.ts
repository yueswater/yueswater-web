export function getFullImageUrl(path: string | null | undefined): string {
  if (!path) return "";

  const isClient = typeof window !== "undefined";

  let internalPath = path;
  if (path.startsWith("http")) {
    try {
      const url = new URL(path);
      internalPath = url.pathname;
    } catch (e) {
      if (isClient) {
        return path.replace(/yueswater-server/g, "localhost");
      }
      return path;
    }
  }

  const baseUrl = isClient
    ? (process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8088")
    : (process.env.SERVER_API_URL?.replace("/api", "") || "http://yueswater-server:8088");

  const cleanPath = internalPath.startsWith("/") ? internalPath : `/${internalPath}`;
  return `${baseUrl}${cleanPath}`;
}

export function processContentImages(content: string): string {
  if (!content) return "";

  const isClient = typeof window !== "undefined";
  
  let processed = content;
  if (isClient) {
    processed = processed.replace(/yueswater-server/g, "localhost");
  }

  const baseUrl = isClient
    ? (process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8088")
    : (process.env.SERVER_API_URL?.replace("/api", "") || "http://yueswater-server:8088");

  return processed.replace(/\/media\//g, `${baseUrl}/media/`);
}