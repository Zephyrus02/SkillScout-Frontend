import blogsData from "@/data/blogs/blogs.json";

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  image: {
    url: string;
    alt: string;
    sourceUrl: string;
  };
  author: {
    name: string;
    role: string;
  };
  content: {
    intro: string;
    sections: BlogSection[];
    conclusion: string;
  };
}

const blogs = blogsData as BlogPost[];

export function getAllBlogs(): BlogPost[] {
  return blogs;
}

export function getFeaturedBlog(): BlogPost {
  return blogs.find((blog) => blog.featured) ?? blogs[0];
}

export function getBlogBySlug(slug?: string | string[]): BlogPost {
  if (!slug) return getFeaturedBlog();

  const normalized = Array.isArray(slug) ? slug[0] : slug;
  return blogs.find((blog) => blog.slug === normalized) ?? getFeaturedBlog();
}

export function getRelatedBlogs(currentSlug: string, count = 3): BlogPost[] {
  return blogs.filter((blog) => blog.slug !== currentSlug).slice(0, count);
}

export function getBlogTopics(limit = 9): string[] {
  return Array.from(new Set(blogs.flatMap((blog) => blog.tags))).slice(
    0,
    limit,
  );
}
