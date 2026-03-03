import Link from "next/link";
import type { BlogPost } from "@/lib/blogs";

type TagColor = "blue" | "purple" | "emerald" | "rose" | "orange" | "indigo";

export type Article = BlogPost;

const TAG_COLORS: Record<TagColor, string> = {
  blue: "text-primary bg-white dark:bg-surface-dark",
  purple: "text-purple-600 bg-white dark:bg-surface-dark",
  emerald: "text-emerald-600 bg-white dark:bg-surface-dark",
  rose: "text-rose-600 bg-white dark:bg-surface-dark",
  orange: "text-orange-600 bg-white dark:bg-surface-dark",
  indigo: "text-indigo-600 bg-white dark:bg-surface-dark",
};

function getTagColor(label: string): TagColor {
  if (label.includes("System") || label.includes("Behavioral")) return "purple";
  if (label.includes("Salary") || label.includes("Offer")) return "emerald";
  if (label.includes("SQL") || label.includes("Data")) return "indigo";
  if (label.includes("Resume")) return "orange";
  if (label.includes("Remote") || label.includes("Communication"))
    return "rose";
  return "blue";
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/resources/blog/${article.slug}`} className="block">
      <article className="flex flex-col rounded-xl bg-gray-50 dark:bg-gray-800/60 overflow-hidden group hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <div
          className="h-48 w-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${article.image.url}')` }}
          aria-label={article.image.alt}
        />
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs font-semibold px-2 py-1 rounded ${TAG_COLORS[getTagColor(tag)]}`}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-subtext-light dark:text-subtext-dark text-sm mb-4 line-clamp-3 flex-grow">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-subtext-light dark:text-subtext-dark pt-4 border-t border-gray-200 dark:border-gray-700">
            <span>{article.date}</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function ArticleListItem({ article }: { article: Article }) {
  return (
    <Link href={`/resources/blog/${article.slug}`} className="block">
      <article className="flex gap-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 p-4 group hover:shadow-md transition-all duration-200">
        <div
          className="w-28 h-20 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700 bg-cover bg-center"
          style={{ backgroundImage: `url('${article.image.url}')` }}
          aria-label={article.image.alt}
        />
        <div className="flex flex-col justify-between flex-grow min-w-0">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded ${TAG_COLORS[getTagColor(tag)]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-sm font-bold text-text-light dark:text-text-dark line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-subtext-light dark:text-subtext-dark mt-2">
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
