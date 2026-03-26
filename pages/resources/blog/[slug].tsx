import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  getAllBlogs,
  getBlogBySlug,
  getRelatedBlogs,
  BlogPost,
  BlogSection,
} from "@/lib/blogs";
import { useReadAloud } from "@/hooks/useReadAloud";
import { useMemo } from "react";

interface Props {
  blog: BlogPost;
}

export default function BlogDetailBySlugPage({ blog }: Props) {
  const related = getRelatedBlogs(blog.slug, 3);

  const { blocks, indices } = useMemo(() => {
    const b: string[] = [];
    let idx = 0;

    b.push(blog.title);
    const title = idx++;

    b.push(blog.content.intro);
    const intro = idx++;

    const sections = blog.content.sections.map((s: BlogSection) => {
      b.push(s.heading);
      const heading = idx++;

      const paragraphs = s.paragraphs.map((p: string) => {
        b.push(p);
        return idx++;
      });

      const bullets = (s.bullets || []).map((bu: string) => {
        b.push(bu);
        return idx++;
      });

      return { heading, paragraphs, bullets };
    });

    b.push("Final Takeaway");
    const finalHeading = idx++;

    b.push(blog.content.conclusion);
    const conclusion = idx++;

    return {
      blocks: b,
      indices: { title, intro, sections, finalHeading, conclusion },
    };
  }, [blog]);

  const { isPlaying, isPaused, currentBlockIndex, highlight, toggle } =
    useReadAloud(blocks);

  const RenderText = ({ text, index }: { text: string; index: number }) => {
    if (index !== currentBlockIndex || !highlight) return <>{text}</>;
    return (
      <span className="transition-all duration-200">
        {text.slice(0, highlight.start)}
        <mark
          className="bg-primary/20 dark:bg-primary/30 text-inherit rounded-sm px-[2px] bg-transparent"
          style={{ backgroundColor: "rgba(56, 189, 248, 0.25)" }}
        >
          {text.slice(highlight.start, highlight.end)}
        </mark>
        {text.slice(highlight.end)}
      </span>
    );
  };

  return (
    <>
      <Head>
        <title>{`${blog.title} | SkillScout`}</title>
        <meta name="description" content={blog.excerpt} />
        <link
          rel="canonical"
          href={`https://www.skillscout.dev/resources/blog/${blog.slug}`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: blog.title,
              description: blog.excerpt,
              datePublished: blog.publishedAt,
              dateModified: blog.publishedAt,
              author: {
                "@type": "Organization",
                name: blog.author.name,
                url:
                  blog.author.url ?? "https://www.skillscout.dev/about",
              },
              publisher: {
                "@id": "https://www.skillscout.dev/#organization",
              },
              image: blog.image.url,
              url: `https://www.skillscout.dev/resources/blog/${blog.slug}`,
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://www.skillscout.dev/resources/blog/${blog.slug}`,
              },
            }),
          }}
        />
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
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-light dark:text-text-dark leading-tight flex-1">
                    <RenderText text={blog.title} index={indices.title} />
                  </h1>
                  <button
                    onClick={toggle}
                    className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-primary flex-shrink-0 mt-2"
                    title={
                      isPlaying && !isPaused ? "Pause Reading" : "Read Aloud"
                    }
                  >
                    <span className="material-icons text-2xl">
                      {isPlaying && !isPaused ? "pause_circle" : "volume_up"}
                    </span>
                  </button>
                </div>
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
                <p className="text-lg">
                  <RenderText text={blog.content.intro} index={indices.intro} />
                </p>

                {blog.content.sections.map(
                  (section: BlogSection, sIdx: number) => {
                    const sIndices = indices.sections[sIdx];
                    if (!sIndices) return null;
                    return (
                      <section key={section.heading}>
                        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-3">
                          <RenderText
                            text={section.heading}
                            index={sIndices.heading}
                          />
                        </h2>
                        <div className="space-y-3">
                          {section.paragraphs.map(
                            (paragraph: string, pIdx: number) => (
                              <p key={pIdx}>
                                <RenderText
                                  text={paragraph}
                                  index={sIndices.paragraphs[pIdx]}
                                />
                              </p>
                            ),
                          )}
                        </div>
                        {section.bullets && section.bullets.length > 0 && (
                          <ul className="mt-4 space-y-2 list-disc pl-5">
                            {section.bullets.map(
                              (item: string, bIdx: number) => (
                                <li key={item}>
                                  <RenderText
                                    text={item}
                                    index={sIndices.bullets[bIdx]}
                                  />
                                </li>
                              ),
                            )}
                          </ul>
                        )}
                      </section>
                    );
                  },
                )}

                <section>
                  <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-3">
                    <RenderText
                      text="Final Takeaway"
                      index={indices.finalHeading}
                    />
                  </h2>
                  <p>
                    <RenderText
                      text={blog.content.conclusion}
                      index={indices.conclusion}
                    />
                  </p>
                </section>
              </div>

              <div className="mt-10 flex flex-wrap gap-2">
                {blog.tags.map((tag: string) => (
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
                  {related.map((item: BlogPost) => (
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

export const getStaticPaths: GetStaticPaths = async () => {
  const blogs = getAllBlogs();
  return {
    paths: blogs.map((b) => ({ params: { slug: b.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const blog = getAllBlogs().find((b) => b.slug === params?.slug);
  if (!blog) return { notFound: true };
  return { props: { blog } };
};
