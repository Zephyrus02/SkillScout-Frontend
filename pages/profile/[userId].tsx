import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { FullProfile } from "@/lib/api";

type PublicProfile = Omit<FullProfile, "resumeUrl" | "resumeFileName">;

interface Props {
  profile: PublicProfile;
}

function toInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const SOCIAL_ICONS: Record<string, string> = {
  linkedin: "linkedin",
  github: "code",
  twitter: "alternate_email",
  website: "language",
};

const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  twitter: "Twitter",
  website: "Website",
};

const PublicProfilePage: NextPage<Props> = ({ profile }) => {
  const { header, skills, employment, education, projects, publications, certifications, socialLinks } = profile;

  const initials = header.name ? toInitials(header.name) : "?";

  const socialEntries = Object.entries(socialLinks ?? {}).filter(
    ([, v]) => v,
  ) as [string, string][];

  return (
    <>
      <Head>
        <title>{header.name ? `${header.name} — SkillScout` : "Public Profile — SkillScout"}</title>
        <meta
          name="description"
          content={
            header.title
              ? `${header.name} · ${header.title} — View profile on SkillScout`
              : `View ${header.name}'s professional profile on SkillScout`
          }
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Navbar />

        <main className="flex-1 pt-16">
          {/* Cover + Avatar hero */}
          <div className="relative w-full h-36 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-16">
            {/* Profile card */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full p-1 bg-white dark:bg-surface-dark shadow-sm shrink-0 -mt-12 sm:-mt-14 z-10 border-2 border-white dark:border-surface-dark">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                    {header.avatarUrl ? (
                      <img
                        src={header.avatarUrl}
                        alt={header.name ?? "Profile"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">{initials}</span>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {header.name || "—"}
                  </h1>
                  {header.title && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                      {header.title}
                    </p>
                  )}

                  {/* Social links */}
                  {socialEntries.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {socialEntries.map(([key, url]) => (
                        <a
                          key={key}
                          href={url.startsWith("http") ? url : `https://${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 transition"
                        >
                          <span className="material-icons text-base">
                            {SOCIAL_ICONS[key] ?? "link"}
                          </span>
                          {SOCIAL_LABELS[key] ?? key}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                {[
                  { icon: "location_on", label: "Location", value: header.location },
                  { icon: "work", label: "Experience", value: header.experience },
                  { icon: "attach_money", label: "Current Salary", value: header.salary },
                  { icon: "calendar_month", label: "Notice Period", value: header.noticePeriod },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-xl">{s.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {s.value || "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Employment */}
                {employment.length > 0 && (
                  <Section title="Experience" icon="work">
                    <div className="space-y-4">
                      {employment.map((emp, i) => (
                        <div key={emp.id ?? i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            {i < employment.length - 1 && (
                              <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />
                            )}
                          </div>
                          <div className="pb-4 flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                              {emp.role}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {emp.company}
                              {emp.startDate && (
                                <> · {emp.startDate} – {emp.current ? "Present" : (emp.endDate ?? "")}</>
                              )}
                            </p>
                            {emp.desc && (
                              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                                {emp.desc}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Education */}
                {education.length > 0 && (
                  <Section title="Education" icon="school">
                    <div className="space-y-4">
                      {education.map((edu, i) => (
                        <div key={edu.id ?? i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                            {i < education.length - 1 && (
                              <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />
                            )}
                          </div>
                          <div className="pb-4 flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                              {edu.degree}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {edu.institution}
                              {edu.startDate && (
                                <> · {edu.startDate} – {edu.current ? "Present" : (edu.endDate ?? "")}</>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                  <Section title="Projects" icon="code">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {projects.map((proj, i) => (
                        <div
                          key={proj.id ?? i}
                          className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
                        >
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {proj.title}
                          </p>
                          {proj.type && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">{proj.type}</p>
                          )}
                          {proj.desc && (
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed line-clamp-3">
                              {proj.desc}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Publications */}
                {publications.length > 0 && (
                  <Section title="Publications" icon="article">
                    <div className="space-y-3">
                      {publications.map((pub, i) => (
                        <div key={pub.id ?? i}>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {pub.title}
                          </p>
                          {pub.publisher && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {pub.publisher}{pub.date && ` · ${pub.date}`}
                            </p>
                          )}
                          {pub.url && (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              View publication →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Skills */}
                {skills.length > 0 && (
                  <Section title="Skills" icon="psychology">
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                  <Section title="Certifications" icon="verified">
                    <div className="space-y-2">
                      {certifications.map((cert, i) => (
                        <div key={cert.id ?? i} className="flex items-start gap-2">
                          <span className="material-icons text-green-500 text-base mt-0.5">verified</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {cert.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {cert.issuer}{cert.issueDate && ` · ${cert.issueDate}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* CTA */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 p-5 text-center">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Hiring for talent?
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Find verified, interview-ready candidates on SkillScout.
                  </p>
                  <Link
                    href="/auth/signup"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-icons text-gray-500 dark:text-gray-400 text-xl">{icon}</span>
        <h2 className="font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const userId = params?.userId as string;
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  try {
    const res = await axios.get(
      `${apiBase}/api/public/profiles/${userId}`,
      { timeout: 8000 },
    );
    return { props: { profile: res.data.data } };
  } catch {
    return { notFound: true };
  }
};

export default PublicProfilePage;
