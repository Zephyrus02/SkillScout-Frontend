import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getBlogBySlug, getRelatedBlogs } from "@/lib/blogs";

export default function BlogDetailBySlugPage() {
  const router = useRouter();
  const blog = getBlogBySlug(router.query.slug);
  const related = getRelatedBlogs(blog.slug, 3);

  return (
    <>
      <Head>
        <title>{`${blog.title} | SkillScout`}</title>
        <meta name="description" content={blog.excerpt} />
      </Head>

      <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans min-h-screen flex flex-col transition-colors duration-300">
        <Navbar />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <article className="lg:col-span-8">
              <nav className="flex items-center gap-2 text-sm text-subtext-light dark:text-subtext-dark mb-6">
                <Link
                  href="/resources"
                  className="hover:text-primary transition-colors"
                >
                  Resources
                </Link>
                <span className="material-icons text-sm">chevron_right</span>
                <span className="font-medium text-text-light dark:text-text-dark">
                  {blog.category}
                </span>
              </nav>

              <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-light dark:text-text-dark leading-tight">
                  {blog.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-5 text-sm text-subtext-light dark:text-subtext-dark">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    {blog.category}
                  </span>
                  <span>{blog.date}</span>
                  <span>•</span>
                  <span>{blog.readTime}</span>
                  <span>•</span>
                  <span>{blog.author.name}</span>
                </div>
              </header>

              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-gray-200 dark:border-gray-800">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${blog.image.url}')` }}
                  aria-label={blog.image.alt}
                />
              </div>
              <div className="space-y-7 text-subtext-light dark:text-subtext-dark leading-relaxed">
                <p className="text-lg">{blog.content.intro}</p>

                {blog.content.sections.map((section) => (
                  <section key={section.heading}>
                    <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-3">
                      {section.heading}
                    </h2>
                    <div className="space-y-3">
                      {section.paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="mt-4 space-y-2 list-disc pl-5">
                        {section.bullets.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}

                <section>
                  <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-3">
                    Final Takeaway
                  </h2>
                  <p>{blog.content.conclusion}</p>
                </section>
              </div>

              <div className="mt-10 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-subtext-light dark:text-subtext-dark text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </article>

            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-fit">
              <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {related.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/resources/blog/${item.slug}`}
                      className="group flex gap-3"
                    >
                      <div
                        className="w-20 h-20 rounded-lg bg-cover bg-center bg-gray-200 dark:bg-gray-700 shrink-0"
                        style={{ backgroundImage: `url('${item.image.url}')` }}
                        aria-label={item.image.alt}
                      />
                      <div>
                        <p className="text-xs text-primary font-semibold mb-1">
                          {item.category}
                        </p>
                        <h4 className="text-sm font-bold text-text-light dark:text-text-dark group-hover:text-primary transition-colors line-clamp-3">
                          {item.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
