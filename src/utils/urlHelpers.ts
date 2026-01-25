export function getFullImageUrl(path: string | null | undefined): string {
  if (!path) return "";

  const isClient = typeof window !== "undefined";

  if (path.startsWith("http") && !path.includes("yueswater-server") && !path.includes("localhost")) {
    return path;
  }

  let internalPath = path;
  if (path.startsWith("http")) {
    try {
      const url = new URL(path);
      internalPath = url.pathname;
    } catch (e) {
      return path;
    }
  }

  const publicUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");
  const serverUrl = process.env.SERVER_API_URL?.replace("/api", "");

  const baseUrl = isClient
    ? (publicUrl || "http://localhost:8088")
    : (serverUrl || publicUrl || "http://yueswater-server:8088");

  const cleanPath = internalPath.startsWith("/") ? internalPath : `/${internalPath}`;
  return `${baseUrl}${cleanPath}`;
}

export function processContentImages(content: string): string {
  if (!content) return "";

  const isClient = typeof window !== "undefined";
  
  const publicUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");
  const serverUrl = process.env.SERVER_API_URL?.replace("/api", "");

  const baseUrl = isClient
    ? (publicUrl || "http://localhost:8088")
    : (serverUrl || publicUrl || "http://yueswater-server:8088");

  return content.replace(/\/media\//g, `${baseUrl}/media/`);
}