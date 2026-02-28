import { useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Settings / User Profile  (screen 50c9bda9)
   Profile header, career profile, resume, projects,
   skills, employment, education, publications, certs.
───────────────────────────────────────────────────────────────── */

export default function SettingsSection() {
  const [emailAlerts, setEmailAlerts] = useState(false);

  return (
    <div className="space-y-6">
      {/* ── Profile Header ── */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 relative overflow-hidden">
        {/* Banner gradient */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-end pt-8 md:pt-0 -mt-4 md:mt-4">
          {/* Avatar */}
          <div className="relative flex flex-col items-center shrink-0">
            <div className="w-28 h-28 rounded-full p-1 bg-white dark:bg-surface-dark shadow-sm z-10">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">AC</span>
              </div>
            </div>
            {/* 100% badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border-2 border-white dark:border-surface-dark shadow-md whitespace-nowrap">
              100%
            </div>
            <button className="absolute bottom-1 right-0 z-20 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-sm border border-gray-100 dark:border-gray-600 text-gray-500 hover:text-blue-600 transition">
              <span className="material-icons text-sm">edit</span>
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Alex Chen
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Senior Software Engineer at TechCorp
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <span className="material-icons text-sm">update</span>
                  Profile last updated - Today
                </p>
              </div>
              <button className="px-4 py-2 border border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl text-sm font-medium transition whitespace-nowrap">
                View Public Profile
              </button>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              {[
                {
                  icon: "location_on",
                  label: "Location",
                  value: "San Francisco, CA",
                },
                {
                  icon: "work",
                  label: "Experience",
                  value: "5 Years 2 Months",
                },
                {
                  icon: "attach_money",
                  label: "Current Salary",
                  value: "$165,000",
                },
                {
                  icon: "calendar_month",
                  label: "Notice Period",
                  value: "1 Month",
                },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-xl">
                    {s.icon}
                  </span>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {s.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {s.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Grid: sidebar (3) + content (9) ── */}
      <div className="grid grid-cols-12 gap-6">
        {/* ── Right sidebar ── */}
        <div className="col-span-12 lg:col-span-3 order-last lg:order-last space-y-6">
          {/* Quick Links */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
            <h3 className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Quick Links
            </h3>
            <nav className="space-y-1 mt-2">
              <a
                href="#resume"
                className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl text-sm font-medium transition-colors"
              >
                <span>Resume</span>
                <span className="material-icons text-base">chevron_right</span>
              </a>
              {["Key Skills", "Employment", "Education"].map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase().replace(" ", "-")}`}
                  className="flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium transition-colors"
                >
                  <span>{l}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-500">
                    Add
                  </span>
                </a>
              ))}
              <a
                href="#projects"
                className="flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium transition-colors"
              >
                <span>Projects</span>
                <span className="material-icons text-base">chevron_right</span>
              </a>
            </nav>
          </div>

          {/* Social Links */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">
                Social Links
              </h3>
              <button className="text-blue-600 text-xs font-bold hover:underline">
                Edit
              </button>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="w-6 h-6 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                  <span className="material-icons text-base">link</span>
                </span>
                <a href="#" className="hover:text-blue-600 truncate">
                  linkedin.com/in/alexchen
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300">
                  <span className="material-icons text-base">code</span>
                </span>
                <a href="#" className="hover:text-blue-600 truncate">
                  github.com/alexchen-dev
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="w-6 h-6 flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                  <span className="material-icons text-base">language</span>
                </span>
                <a href="#" className="hover:text-blue-600 truncate">
                  alexchen.io
                </a>
              </li>
            </ul>
          </div>

          {/* Account Settings */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons text-gray-900 dark:text-white">
                settings
              </span>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Account Settings
              </h3>
            </div>
            <div className="space-y-4">
              {/* Email toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Email Preferences
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive daily job alerts
                  </p>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${emailAlerts ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${emailAlerts ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
              {/* Change Password */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <button className="w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition flex justify-between items-center py-2">
                  <span>Change Password</span>
                  <span className="material-icons text-base text-gray-400">
                    history
                  </span>
                </button>
              </div>
              {/* Delete Account */}
              <div className="pt-2">
                <button className="w-full text-left text-sm font-bold text-red-500 hover:text-red-600 transition flex justify-between items-center py-2">
                  <span>Delete Account</span>
                  <span className="material-icons text-base">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main content col-span-9 ── */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Career Profile */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Career profile
                </h2>
                <button className="p-1.5 text-gray-400 hover:text-blue-600 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span className="material-icons text-lg">edit</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              {[
                ["Current industry", "Software Product"],
                ["Department", "Engineering - Software & QA"],
                ["Role category", "Software Development"],
                ["Job role", "Full Stack Developer"],
                ["Desired job type", "permanent"],
                ["Desired employment type", "Full Time"],
                ["Preferred shift", "Day"],
                ["Preferred work location", "Pune"],
                ["Expected salary", "₹8,00,000"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {label}
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Resume */}
          <div
            id="resume"
            className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Resume
              </h2>
              <button className="text-blue-600 text-sm font-medium hover:underline">
                Update
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  alex_chen_resume_v4.pdf
                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white text-xs">
                      check
                    </span>
                  </span>
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Uploaded on Feb 24, 2024
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-500 transition shadow-sm">
                  <span className="material-icons text-lg">download</span>
                </button>
                <button className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-500 transition shadow-sm">
                  <span className="material-icons text-lg">delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Resume Headline */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Resume Headline
              </h2>
              <button className="p-1.5 text-gray-400 hover:text-blue-600 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <span className="material-icons text-lg">edit</span>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Senior Full Stack Engineer with 5+ years of experience in building
              scalable web applications using React, Node.js, and AWS. Proven
              track record of optimizing system performance by 40% and leading
              cross-functional teams. Passionate about AI-driven development
              tools and cloud architecture.
            </p>
          </div>

          {/* Projects */}
          <div
            id="projects"
            className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Projects
              </h2>
              <button className="text-blue-600 text-sm font-bold hover:underline">
                Add project
              </button>
            </div>
            <div className="space-y-8">
              {[
                {
                  title: "Ascendancy Esports Website",
                  type: "(Offsite)",
                  period: "Feb 2025 to Feb 2025 (Full Time)",
                  desc: "An full stack webs application for end-to-end management of eSports tournaments for Valorant. The website is built using React.js and Node.js and uses MongoDB as the database. The website has a very attractive UI/UX based around a gaming theme. The website includes realtime showcasing...",
                  readMore: true,
                },
                {
                  title:
                    "Collaborative Vehicle Localization using LSTM based Federated Learning for Trajectory Prediction",
                  type: "(Offsite)",
                  period: "Jan 2025 to Apr 2025 (Full Time)",
                  desc: "Built a privacy-preserving trajectory prediction system using federated learning, improving the average displacement error by 29.2% when compared to traditional approaches.",
                  readMore: false,
                },
                {
                  title: "SkillScout",
                  type: "(Offsite)",
                  period: "Nov 2024 to Jan 2025 (Full Time)",
                  desc: "A smart resume parser which recommends active jobs based on the skills, projects, experiences and educational qualification of the candidates",
                  readMore: false,
                },
                {
                  title:
                    "Light Weight Computational Offloading using Deep Learning",
                  type: "(Offsite)",
                  period: "Aug 2024 to Nov 2024 (Full Time)",
                  desc: "Analyzed operational metrics and identified key bottlenecks within existing systems, resulting in targeted adjustments that improved system efficiency by more than 30%, while simultaneously reducing server downtime by 15% by performing quantization of models to reduce complexity by an...",
                  readMore: true,
                },
              ].map((p) => (
                <div key={p.title} className="group">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                      {p.title}
                    </h4>
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 shrink-0">
                      <span className="material-icons text-base">edit</span>
                    </button>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {p.type}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {p.period}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {p.desc}{" "}
                    {p.readMore && (
                      <button className="text-blue-600 font-medium hover:underline">
                        Read More
                      </button>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Skills */}
          <div
            id="key-skills"
            className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Key Skills
              </h2>
              <button className="p-1.5 text-gray-400 hover:text-blue-600 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <span className="material-icons text-lg">edit</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "React.js",
                "Node.js",
                "TypeScript",
                "AWS Lambda",
                "System Design",
                "GraphQL",
                "PostgreSQL",
                "Docker",
                "Microservices",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  {skill}
                </span>
              ))}
              <button className="px-3 py-1.5 bg-white dark:bg-surface-dark border border-dashed border-gray-300 dark:border-gray-600 rounded-full text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-center gap-1">
                <span className="material-icons text-sm">add</span>
                Add Skill
              </button>
            </div>
          </div>

          {/* Employment + Education */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employment */}
            <div
              id="employment"
              className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Employment
                </h2>
                <button className="text-blue-600 text-sm font-bold hover:underline">
                  Add
                </button>
              </div>
              <div className="space-y-6">
                <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-surface-dark" />
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Senior Software Engineer
                  </h4>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    TechCorp Inc.
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Aug 2021 - Present • 2 yrs 7 mos
                  </p>
                </div>
                <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-surface-dark" />
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Software Engineer
                  </h4>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Innovate Solutions
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Jun 2019 - Jul 2021 • 2 yrs 2 mos
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div
              id="education"
              className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Education
                </h2>
                <button className="text-blue-600 text-sm font-bold hover:underline">
                  Add
                </button>
              </div>
              <div className="space-y-6">
                <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-surface-dark" />
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    M.S. Computer Science
                  </h4>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Stanford University
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    2017 - 2019
                  </p>
                </div>
                <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-surface-dark" />
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    B.Tech Information Technology
                  </h4>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    MIT
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    2013 - 2017
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Research Publications + Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Research Publications */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Research Publications
                </h2>
                <button className="text-blue-600 text-sm font-bold hover:underline">
                  Add
                </button>
              </div>
              <div className="space-y-5">
                <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-2">
                    Optimizing Microservices Architecture for High-Load Systems
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    IEEE Software • Nov 2023
                  </p>
                  <a
                    href="#"
                    className="text-xs font-medium text-blue-600 flex items-center gap-1 hover:underline"
                  >
                    <span className="material-icons text-sm">open_in_new</span>
                    View Publication
                  </a>
                </div>
                <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-2">
                    AI-Driven Code Review: A Comparative Study
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    ACM Digital Library • Jun 2022
                  </p>
                  <a
                    href="#"
                    className="text-xs font-medium text-blue-600 flex items-center gap-1 hover:underline"
                  >
                    <span className="material-icons text-sm">open_in_new</span>
                    View Publication
                  </a>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Certifications
                </h2>
                <button className="text-blue-600 text-sm font-bold hover:underline">
                  Add
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                    <span className="material-icons text-orange-500 text-lg">
                      verified
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      AWS Certified Solutions Architect
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Amazon Web Services • Expires Dec 2025
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <span className="material-icons text-blue-500 text-lg">
                      verified
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      Certified Kubernetes Administrator
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      CNCF • Issued Jan 2023
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
