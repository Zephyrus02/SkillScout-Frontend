import { useState, useRef, useEffect } from "react";
import SKILLS from "@/data/skills";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
interface ProfileHeader {
  name: string;
  title: string;
  location: string;
  experience: string;
  salary: string;
  noticePeriod: string;
  avatarUrl: string | null;
  avatarInitials: string;
}

interface CareerProfile {
  currentIndustry: string;
  department: string;
  roleCategory: string;
  jobRole: string;
  desiredJobType: string;
  desiredEmploymentType: string;
  preferredShift: string;
  preferredWorkLocation: string;
  expectedSalary: string;
}

interface Project {
  id: number;
  title: string;
  type: string;
  period: string;
  desc: string;
}

interface Employment {
  id: number;
  role: string;
  company: string;
  startDate: string; // "MMM YYYY"
  endDate: string; // "MMM YYYY" | "Present"
  current: boolean;
  desc: string;
}

interface Education {
  id: number;
  degree: string;
  institution: string;
  startDate: string; // "MMM YYYY"
  endDate: string; // "MMM YYYY"
}

interface Publication {
  id: number;
  title: string;
  publisher: string;
  date: string;
  url: string;
  desc: string;
}

interface Certification {
  id: number;
  name: string;
  issuer: string;
  issueDate: string; // "MMM YYYY"
  doesExpire: boolean;
  expiryDate: string; // "MMM YYYY"
}

interface SocialLinks {
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Reusable Modal
───────────────────────────────────────────────────────────────────────────── */
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Month-Year Picker
───────────────────────────────────────────────────────────────────────────── */
function MonthYearPicker({
  value,
  onChange,
  placeholder = "Select month & year",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const parts = value ? value.split(" ") : [];
  const selMonth = parts[0] || "";
  const selYear = parts[1] ? parseInt(parts[1]) : new Date().getFullYear();
  const [year, setYear] = useState(selYear);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // sync year when value changes externally
  useEffect(() => {
    if (parts[1]) setYear(parseInt(parts[1]));
  }, [value]);

  const select = (m: string) => {
    onChange(`${m} ${year}`);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-left text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
      >
        <span className={value ? "" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <span className="material-icons text-sm text-gray-400">
          calendar_today
        </span>
      </button>
      {open && (
        <div className="absolute z-[60] top-full mt-1 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 w-56">
          <div className="flex justify-between items-center mb-3">
            <button
              type="button"
              onClick={() => setYear((y) => y - 1)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <span className="material-icons text-base">chevron_left</span>
            </button>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {year}
            </span>
            <button
              type="button"
              onClick={() => setYear((y) => y + 1)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <span className="material-icons text-base">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {MONTHS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => select(m)}
                className={`text-xs py-1.5 rounded-lg transition font-medium ${
                  selMonth === m && selYear === year
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-blue-600"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Shared input / textarea styles
───────────────────────────────────────────────────────────────────────────── */
const inputCls =
  "w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

const cancelBtnCls =
  "px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition";

const saveBtnCls =
  "px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition";

/* ─────────────────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────────────────── */
export default function SettingsSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [resumeFileName, setResumeFileName] = useState(
    "alex_chen_resume_v4.pdf",
  );
  const [resumeUploadDate, setResumeUploadDate] = useState("Feb 24, 2024");

  /* ── Skills search ──────────────────────────────────────────────────────── */
  const [skillQuery, setSkillQuery] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const skillInputRef = useRef<HTMLInputElement>(null);
  const skillDropdownRef = useRef<HTMLDivElement>(null);

  /* ── Profile Header ─────────────────────────────────────────────────────── */
  const [profile, setProfile] = useState<ProfileHeader>({
    name: "Alex Chen",
    title: "Senior Software Engineer at TechCorp",
    location: "San Francisco, CA",
    experience: "5 Years 2 Months",
    salary: "$165,000",
    noticePeriod: "1 Month",
    avatarUrl: null,
    avatarInitials: "AC",
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState<ProfileHeader>(profile);

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile((p) => ({ ...p, avatarUrl: url }));
    }
  };
  const saveProfile = () => {
    setProfile(profileDraft);
    setEditingProfile(false);
  };

  /* ── Career Profile ─────────────────────────────────────────────────────── */
  const [careerProfile, setCareerProfile] = useState<CareerProfile>({
    currentIndustry: "Software Product",
    department: "Engineering - Software & QA",
    roleCategory: "Software Development",
    jobRole: "Full Stack Developer",
    desiredJobType: "permanent",
    desiredEmploymentType: "Full Time",
    preferredShift: "Day",
    preferredWorkLocation: "Pune",
    expectedSalary: "₹8,00,000",
  });
  const [editingCareer, setEditingCareer] = useState(false);
  const [careerDraft, setCareerDraft] = useState<CareerProfile>(careerProfile);

  const careerLabels: Record<keyof CareerProfile, string> = {
    currentIndustry: "Current Industry",
    department: "Department",
    roleCategory: "Role Category",
    jobRole: "Job Role",
    desiredJobType: "Desired Job Type",
    desiredEmploymentType: "Desired Employment Type",
    preferredShift: "Preferred Shift",
    preferredWorkLocation: "Preferred Work Location",
    expectedSalary: "Expected Salary",
  };

  const saveCareer = () => {
    setCareerProfile(careerDraft);
    setEditingCareer(false);
  };

  /* ── Resume Headline ────────────────────────────────────────────────────── */
  const [resumeHeadline, setResumeHeadline] = useState(
    "Senior Full Stack Engineer with 5+ years of experience in building scalable web applications using React, Node.js, and AWS. Proven track record of optimizing system performance by 40% and leading cross-functional teams. Passionate about AI-driven development tools and cloud architecture.",
  );
  const [editingHeadline, setEditingHeadline] = useState(false);
  const [headlineDraft, setHeadlineDraft] = useState(resumeHeadline);

  /* ── Projects ───────────────────────────────────────────────────────────── */
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "Ascendancy Esports Website",
      type: "(Offsite)",
      period: "Feb 2025 to Feb 2025 (Full Time)",
      desc: "An full stack web application for end-to-end management of eSports tournaments for Valorant. The website is built using React.js and Node.js and uses MongoDB as the database. The website has a very attractive UI/UX based around a gaming theme. The website includes realtime showcasing...",
    },
    {
      id: 2,
      title:
        "Collaborative Vehicle Localization using LSTM based Federated Learning for Trajectory Prediction",
      type: "(Offsite)",
      period: "Jan 2025 to Apr 2025 (Full Time)",
      desc: "Built a privacy-preserving trajectory prediction system using federated learning, improving the average displacement error by 29.2% when compared to traditional approaches.",
    },
    {
      id: 3,
      title: "SkillScout",
      type: "(Offsite)",
      period: "Nov 2024 to Jan 2025 (Full Time)",
      desc: "A smart resume parser which recommends active jobs based on the skills, projects, experiences and educational qualification of the candidates",
    },
    {
      id: 4,
      title: "Light Weight Computational Offloading using Deep Learning",
      type: "(Offsite)",
      period: "Aug 2024 to Nov 2024 (Full Time)",
      desc: "Analyzed operational metrics and identified key bottlenecks within existing systems, resulting in targeted adjustments that improved system efficiency by more than 30%, while simultaneously reducing server downtime by 15% by performing quantization of models to reduce complexity by an...",
    },
  ]);
  const blankProject: Omit<Project, "id"> = {
    title: "",
    type: "(Offsite)",
    period: "",
    desc: "",
  };
  const [projectDraft, setProjectDraft] =
    useState<Omit<Project, "id">>(blankProject);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [addingProject, setAddingProject] = useState(false);

  const openAddProject = () => {
    setProjectDraft(blankProject);
    setEditingProject(null);
    setAddingProject(true);
  };
  const openEditProject = (p: Project) => {
    setProjectDraft({
      title: p.title,
      type: p.type,
      period: p.period,
      desc: p.desc,
    });
    setEditingProject(p);
    setAddingProject(false);
  };
  const closeProjectModal = () => {
    setAddingProject(false);
    setEditingProject(null);
  };
  const saveProject = () => {
    if (editingProject) {
      setProjects((ps) =>
        ps.map((p) =>
          p.id === editingProject.id ? { ...projectDraft, id: p.id } : p,
        ),
      );
    } else {
      setProjects((ps) => [...ps, { ...projectDraft, id: Date.now() }]);
    }
    closeProjectModal();
  };
  const deleteProject = (id: number) =>
    setProjects((ps) => ps.filter((p) => p.id !== id));

  /* ── Key Skills ─────────────────────────────────────────────────────────── */
  const [skills, setSkills] = useState([
    "React.js",
    "Node.js",
    "TypeScript",
    "AWS Lambda",
    "System Design",
    "GraphQL",
    "PostgreSQL",
    "Docker",
    "Microservices",
  ]);

  const removeSkill = (skill: string) =>
    setSkills((prev) => prev.filter((s) => s !== skill));

  const filteredSkillSuggestions = skillQuery.trim()
    ? SKILLS.filter((s) =>
        s.toLowerCase().includes(skillQuery.toLowerCase()),
      ).slice(0, 10)
    : [];

  /* ── Employment ─────────────────────────────────────────────────────────── */
  const [employment, setEmployment] = useState<Employment[]>([
    {
      id: 1,
      role: "Senior Software Engineer",
      company: "TechCorp Inc.",
      startDate: "Aug 2021",
      endDate: "Present",
      current: true,
      desc: "Led a team of 6 engineers building microservices on AWS. Optimized critical query paths reducing p95 latency by 40%. Drove migration from monolith to event-driven architecture.",
    },
    {
      id: 2,
      role: "Software Engineer",
      company: "Innovate Solutions",
      startDate: "Jun 2019",
      endDate: "Jul 2021",
      current: false,
      desc: "Built and maintained full-stack features for a SaaS platform. Reduced page load times by 35% through code-splitting and caching strategies.",
    },
  ]);
  const blankEmp: Omit<Employment, "id"> = {
    role: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    desc: "",
  };
  const [empDraft, setEmpDraft] = useState<Omit<Employment, "id">>(blankEmp);
  const [editingEmp, setEditingEmp] = useState<Employment | null>(null);
  const [addingEmp, setAddingEmp] = useState(false);

  const openAddEmp = () => {
    setEmpDraft(blankEmp);
    setEditingEmp(null);
    setAddingEmp(true);
  };
  const openEditEmp = (e: Employment) => {
    setEmpDraft({
      role: e.role,
      company: e.company,
      startDate: e.startDate,
      endDate: e.endDate,
      current: e.current,
      desc: e.desc,
    });
    setEditingEmp(e);
    setAddingEmp(false);
  };
  const closeEmpModal = () => {
    setAddingEmp(false);
    setEditingEmp(null);
  };
  const saveEmp = () => {
    if (editingEmp) {
      setEmployment((es) =>
        es.map((e) => (e.id === editingEmp.id ? { ...empDraft, id: e.id } : e)),
      );
    } else {
      setEmployment((es) => [...es, { ...empDraft, id: Date.now() }]);
    }
    closeEmpModal();
  };
  const deleteEmp = (id: number) =>
    setEmployment((es) => es.filter((e) => e.id !== id));

  /* ── Education ──────────────────────────────────────────────────────────── */
  const [education, setEducation] = useState<Education[]>([
    {
      id: 1,
      degree: "M.S. Computer Science",
      institution: "Stanford University",
      startDate: "Sep 2017",
      endDate: "Jun 2019",
    },
    {
      id: 2,
      degree: "B.Tech Information Technology",
      institution: "MIT",
      startDate: "Aug 2013",
      endDate: "May 2017",
    },
  ]);
  const blankEdu: Omit<Education, "id"> = {
    degree: "",
    institution: "",
    startDate: "",
    endDate: "",
  };
  const [eduDraft, setEduDraft] = useState<Omit<Education, "id">>(blankEdu);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [addingEdu, setAddingEdu] = useState(false);

  const openAddEdu = () => {
    setEduDraft(blankEdu);
    setEditingEdu(null);
    setAddingEdu(true);
  };
  const openEditEdu = (e: Education) => {
    setEduDraft({
      degree: e.degree,
      institution: e.institution,
      startDate: e.startDate,
      endDate: e.endDate,
    });
    setEditingEdu(e);
    setAddingEdu(false);
  };
  const closeEduModal = () => {
    setAddingEdu(false);
    setEditingEdu(null);
  };
  const saveEdu = () => {
    if (editingEdu) {
      setEducation((eds) =>
        eds.map((e) =>
          e.id === editingEdu.id ? { ...eduDraft, id: e.id } : e,
        ),
      );
    } else {
      setEducation((eds) => [...eds, { ...eduDraft, id: Date.now() }]);
    }
    closeEduModal();
  };
  const deleteEdu = (id: number) =>
    setEducation((eds) => eds.filter((e) => e.id !== id));

  /* ── Publications ───────────────────────────────────────────────────────── */
  const [publications, setPublications] = useState<Publication[]>([
    {
      id: 1,
      title: "Optimizing Microservices Architecture for High-Load Systems",
      publisher: "IEEE Software",
      date: "Nov 2023",
      url: "#",
      desc: "Presents a novel framework for decomposing monolithic systems into resilient microservices with adaptive load balancing, reducing infrastructure costs by 28%.",
    },
    {
      id: 2,
      title: "AI-Driven Code Review: A Comparative Study",
      publisher: "ACM Digital Library",
      date: "Jun 2022",
      url: "#",
      desc: "Benchmarks five LLM-based code-review tools against human reviewers across bug detection, style enforcement, and security auditing metrics.",
    },
  ]);
  const blankPub: Omit<Publication, "id"> = {
    title: "",
    publisher: "",
    date: "",
    url: "",
    desc: "",
  };
  const [pubDraft, setPubDraft] = useState<Omit<Publication, "id">>(blankPub);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [addingPub, setAddingPub] = useState(false);

  const openAddPub = () => {
    setPubDraft(blankPub);
    setEditingPub(null);
    setAddingPub(true);
  };
  const openEditPub = (p: Publication) => {
    setPubDraft({
      title: p.title,
      publisher: p.publisher,
      date: p.date,
      url: p.url,
      desc: p.desc,
    });
    setEditingPub(p);
    setAddingPub(false);
  };
  const closePubModal = () => {
    setAddingPub(false);
    setEditingPub(null);
  };
  const savePub = () => {
    if (editingPub) {
      setPublications((ps) =>
        ps.map((p) => (p.id === editingPub.id ? { ...pubDraft, id: p.id } : p)),
      );
    } else {
      setPublications((ps) => [...ps, { ...pubDraft, id: Date.now() }]);
    }
    closePubModal();
  };
  const deletePub = (id: number) =>
    setPublications((ps) => ps.filter((p) => p.id !== id));

  /* ── Certifications ─────────────────────────────────────────────────────── */
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      issueDate: "Dec 2022",
      doesExpire: true,
      expiryDate: "Dec 2025",
    },
    {
      id: 2,
      name: "Certified Kubernetes Administrator",
      issuer: "CNCF",
      issueDate: "Jan 2023",
      doesExpire: false,
      expiryDate: "",
    },
  ]);
  const blankCert: Omit<Certification, "id"> = {
    name: "",
    issuer: "",
    issueDate: "",
    doesExpire: false,
    expiryDate: "",
  };
  const [certDraft, setCertDraft] =
    useState<Omit<Certification, "id">>(blankCert);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [addingCert, setAddingCert] = useState(false);

  const openAddCert = () => {
    setCertDraft(blankCert);
    setEditingCert(null);
    setAddingCert(true);
  };
  const openEditCert = (c: Certification) => {
    setCertDraft({
      name: c.name,
      issuer: c.issuer,
      issueDate: c.issueDate,
      doesExpire: c.doesExpire,
      expiryDate: c.expiryDate,
    });
    setEditingCert(c);
    setAddingCert(false);
  };
  const closeCertModal = () => {
    setAddingCert(false);
    setEditingCert(null);
  };
  const saveCert = () => {
    if (editingCert) {
      setCertifications((cs) =>
        cs.map((c) =>
          c.id === editingCert.id ? { ...certDraft, id: c.id } : c,
        ),
      );
    } else {
      setCertifications((cs) => [...cs, { ...certDraft, id: Date.now() }]);
    }
    closeCertModal();
  };
  const deleteCert = (id: number) =>
    setCertifications((cs) => cs.filter((c) => c.id !== id));

  /* ── Social Links ───────────────────────────────────────────────────────── */
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    linkedin: "linkedin.com/in/alexchen",
    github: "github.com/alexchen-dev",
    twitter: "twitter.com/alexchen",
    website: "alexchen.io",
  });
  const [editingSocial, setEditingSocial] = useState(false);
  const [socialDraft, setSocialDraft] = useState<SocialLinks>(socialLinks);

  const saveSocial = () => {
    setSocialLinks(socialDraft);
    setEditingSocial(false);
  };

  /* ─────────────────────────────────────────────────────────────────────────
     Render
  ───────────────────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />
      {/* Hidden file input for resume upload */}
      <input
        ref={resumeFileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setResumeFileName(file.name);
            const d = new Date();
            setResumeUploadDate(
              d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            );
          }
        }}
      />

      {/* ── Profile Header ───────────────────────────────────────────────── */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-end pt-8 md:pt-0 -mt-4 md:mt-4">
          {/* Avatar */}
          <div className="relative flex flex-col items-center shrink-0">
            <div className="w-28 h-28 rounded-full p-1 bg-white dark:bg-surface-dark shadow-sm z-10">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {profile.avatarInitials}
                  </span>
                )}
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border-2 border-white dark:border-surface-dark shadow-md whitespace-nowrap">
              100%
            </div>
            <button
              onClick={handleAvatarClick}
              title="Upload profile picture"
              className="absolute bottom-1 right-0 z-20 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-sm border border-gray-100 dark:border-gray-600 text-gray-500 hover:text-blue-600 transition"
            >
              <span className="material-icons text-sm">edit</span>
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {profile.title}
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <span className="material-icons text-sm">update</span>
                  Profile last updated - Today
                </p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <button
                  onClick={() => {
                    setProfileDraft(profile);
                    setEditingProfile(true);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-medium transition whitespace-nowrap"
                >
                  Edit Profile
                </button>
                <button className="px-4 py-2 border border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl text-sm font-medium transition whitespace-nowrap">
                  View Public Profile
                </button>
              </div>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              {[
                {
                  icon: "location_on",
                  label: "Location",
                  value: profile.location,
                },
                {
                  icon: "work",
                  label: "Experience",
                  value: profile.experience,
                },
                {
                  icon: "attach_money",
                  label: "Current Salary",
                  value: profile.salary,
                },
                {
                  icon: "calendar_month",
                  label: "Notice Period",
                  value: profile.noticePeriod,
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

      {/* ── Main Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6">
        {/* ── Sidebar ── */}
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
              <button
                onClick={() => {
                  setSocialDraft(socialLinks);
                  setEditingSocial(true);
                }}
                className="text-blue-600 text-xs font-bold hover:underline"
              >
                Edit
              </button>
            </div>
            <ul className="space-y-3">
              {(
                [
                  {
                    key: "linkedin" as keyof SocialLinks,
                    icon: (
                      <span
                        className="w-7 h-7 flex items-center justify-center rounded-lg"
                        style={{ background: "#0A66C2" }}
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </span>
                    ),
                  },
                  {
                    key: "github" as keyof SocialLinks,
                    icon: (
                      <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-100">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4 h-4 fill-white dark:fill-gray-900"
                        >
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                      </span>
                    ),
                  },
                  {
                    key: "twitter" as keyof SocialLinks,
                    icon: (
                      <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-black dark:bg-white">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4 h-4 fill-white dark:fill-black"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </span>
                    ),
                  },
                  {
                    key: "website" as keyof SocialLinks,
                    icon: (
                      <span
                        className="w-7 h-7 flex items-center justify-center rounded-lg"
                        style={{ background: "#7C3AED" }}
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                      </span>
                    ),
                  },
                ] as { key: keyof SocialLinks; icon: React.ReactNode }[]
              )
                .filter(({ key }) => !!(socialLinks[key] ?? "").trim())
                .map(({ key, icon }) => {
                  const raw = socialLinks[key];
                  const href = /^https?:\/\//i.test(raw)
                    ? raw
                    : `https://${raw}`;
                  return (
                    <li
                      key={key}
                      className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
                    >
                      {icon}
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate hover:text-blue-600 hover:underline"
                      >
                        {raw}
                      </a>
                    </li>
                  );
                })}
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
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    emailAlerts ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      emailAlerts ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <button className="w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition flex justify-between items-center py-2">
                  <span>Change Password</span>
                  <span className="material-icons text-base text-gray-400">
                    history
                  </span>
                </button>
              </div>
              <div className="pt-2">
                <button className="w-full text-left text-sm font-bold text-red-500 hover:text-red-600 transition flex justify-between items-center py-2">
                  <span>Delete Account</span>
                  <span className="material-icons text-base">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Career Profile */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Career profile
                </h2>
                <button
                  onClick={() => {
                    setCareerDraft(careerProfile);
                    setEditingCareer(true);
                  }}
                  className="p-1.5 text-gray-400 hover:text-blue-600 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <span className="material-icons text-lg">edit</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              {(
                Object.entries(careerLabels) as [keyof CareerProfile, string][]
              ).map(([key, label]) => (
                <div key={key}>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {label}
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {careerProfile[key]}
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
              <button
                onClick={() => resumeFileInputRef.current?.click()}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Update
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {resumeFileName}
                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white text-xs">
                      check
                    </span>
                  </span>
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Uploaded on {resumeUploadDate}
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
                Profile Headline
              </h2>
              <button
                onClick={() => {
                  setHeadlineDraft(resumeHeadline);
                  setEditingHeadline(true);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span className="material-icons text-lg">edit</span>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {resumeHeadline}
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
              <button
                onClick={openAddProject}
                className="text-blue-600 text-sm font-bold hover:underline"
              >
                Add project
              </button>
            </div>
            <div className="space-y-8">
              {projects.map((p) => (
                <div key={p.id} className="group">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white pr-2">
                      {p.title}
                    </h4>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                      <button
                        onClick={() => openEditProject(p)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <span className="material-icons text-base">edit</span>
                      </button>
                      <button
                        onClick={() => deleteProject(p.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <span className="material-icons text-base">delete</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {p.type}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {p.period}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {p.desc}
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Key Skills
              </h2>
            </div>

            {/* Fixed input + autocomplete at top */}
            <div className="relative mb-5" ref={skillDropdownRef}>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={skillInputRef}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    placeholder="Search or type a skill..."
                    value={skillQuery}
                    onChange={(e) => {
                      setSkillQuery(e.target.value);
                      setShowSkillDropdown(true);
                    }}
                    onFocus={() => setShowSkillDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSkillDropdown(false), 150)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const s = skillQuery.trim();
                        if (s && !skills.includes(s)) {
                          setSkills((prev) => [...prev, s]);
                        }
                        setSkillQuery("");
                        setShowSkillDropdown(false);
                      }
                    }}
                  />
                  {skillQuery && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setSkillQuery("");
                        setShowSkillDropdown(false);
                      }}
                    >
                      <span className="material-icons text-sm">close</span>
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const s = skillQuery.trim();
                    if (s && !skills.includes(s)) {
                      setSkills((prev) => [...prev, s]);
                    }
                    setSkillQuery("");
                    setShowSkillDropdown(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition whitespace-nowrap"
                >
                  Add
                </button>
              </div>

              {/* Autocomplete dropdown */}
              {showSkillDropdown && filteredSkillSuggestions.length > 0 && (
                <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                  {filteredSkillSuggestions.map((s) => {
                    const alreadyAdded = skills.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={alreadyAdded}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition ${
                          alreadyAdded
                            ? "text-gray-400 dark:text-gray-600 cursor-default bg-gray-50 dark:bg-gray-800/50"
                            : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"
                        }`}
                        onMouseDown={(e) => {
                          if (alreadyAdded) return;
                          e.preventDefault();
                          setSkills((prev) => [...prev, s]);
                          setSkillQuery("");
                          setShowSkillDropdown(false);
                        }}
                      >
                        <span>{s}</span>
                        {alreadyAdded && (
                          <span className="material-icons text-sm text-green-500">
                            check
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Skills chips */}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 group"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-0.5 text-gray-400 hover:text-red-500 transition leading-none"
                  >
                    <span className="material-icons text-xs">close</span>
                  </button>
                </span>
              ))}
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
                <button
                  onClick={openAddEmp}
                  className="text-blue-600 text-sm font-bold hover:underline"
                >
                  Add
                </button>
              </div>
              <div className="space-y-6">
                {employment.map((e) => (
                  <div
                    key={e.id}
                    className="group relative pl-4 border-l-2 border-gray-200 dark:border-gray-700"
                  >
                    <div
                      className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-surface-dark ${
                        e.current
                          ? "bg-blue-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                          {e.role}
                        </h4>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {e.company}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {e.startDate} – {e.current ? "Present" : e.endDate}
                        </p>
                        {e.desc && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                            {e.desc}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => openEditEmp(e)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition rounded"
                        >
                          <span className="material-icons text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => deleteEmp(e.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition rounded"
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                <button
                  onClick={openAddEdu}
                  className="text-blue-600 text-sm font-bold hover:underline"
                >
                  Add
                </button>
              </div>
              <div className="space-y-6">
                {education.map((e) => (
                  <div
                    key={e.id}
                    className="group relative pl-4 border-l-2 border-gray-200 dark:border-gray-700"
                  >
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-surface-dark" />
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                          {e.degree}
                        </h4>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {e.institution}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {e.startDate} – {e.endDate}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => openEditEdu(e)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition rounded"
                        >
                          <span className="material-icons text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => deleteEdu(e.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition rounded"
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                <button
                  onClick={openAddPub}
                  className="text-blue-600 text-sm font-bold hover:underline"
                >
                  Add
                </button>
              </div>
              <div className="space-y-5">
                {publications.map((pub) => (
                  <div
                    key={pub.id}
                    className="group border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight pr-2">
                        {pub.title}
                      </h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                        <button
                          onClick={() => openEditPub(pub)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition rounded"
                        >
                          <span className="material-icons text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => deletePub(pub.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition rounded"
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {pub.publisher} • {pub.date}
                    </p>
                    {pub.desc && (
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-2">
                        {pub.desc}
                      </p>
                    )}
                    <a
                      href={pub.url}
                      className="text-xs font-medium text-blue-600 flex items-center gap-1 hover:underline"
                    >
                      <span className="material-icons text-sm">
                        open_in_new
                      </span>
                      View Publication
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Certifications
                </h2>
                <button
                  onClick={openAddCert}
                  className="text-blue-600 text-sm font-bold hover:underline"
                >
                  Add
                </button>
              </div>
              <div className="space-y-4">
                {certifications.map((cert, idx) => (
                  <div
                    key={cert.id}
                    className="group flex items-start gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        idx % 2 === 0
                          ? "bg-orange-100 dark:bg-orange-900/20"
                          : "bg-blue-100 dark:bg-blue-900/20"
                      }`}
                    >
                      <span
                        className={`material-icons text-lg ${
                          idx % 2 === 0 ? "text-orange-500" : "text-blue-500"
                        }`}
                      >
                        verified
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {cert.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {cert.issuer}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Issued: {cert.issueDate}
                        {cert.doesExpire && cert.expiryDate
                          ? ` • Expires: ${cert.expiryDate}`
                          : " • No Expiry"}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                      <button
                        onClick={() => openEditCert(cert)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition rounded"
                      >
                        <span className="material-icons text-sm">edit</span>
                      </button>
                      <button
                        onClick={() => deleteCert(cert.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition rounded"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MODALS
      ════════════════════════════════════════════════════════════════════ */}

      {/* Edit Profile */}
      {editingProfile && (
        <Modal title="Edit Profile" onClose={() => setEditingProfile(false)}>
          <div className="space-y-4">
            {(
              [
                { label: "Full Name", key: "name" },
                { label: "Title / Position", key: "title" },
                { label: "Location", key: "location" },
                {
                  label: "Experience (e.g. 5 Years 2 Months)",
                  key: "experience",
                },
                { label: "Current Salary", key: "salary" },
                { label: "Notice Period", key: "noticePeriod" },
              ] as { label: string; key: keyof ProfileHeader }[]
            ).map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {label}
                </label>
                <input
                  className={inputCls}
                  value={profileDraft[key] as string}
                  onChange={(e) =>
                    setProfileDraft((d) => ({ ...d, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingProfile(false)}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button onClick={saveProfile} className={saveBtnCls}>
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Career Profile */}
      {editingCareer && (
        <Modal
          title="Edit Career Profile"
          onClose={() => setEditingCareer(false)}
        >
          <div className="space-y-4">
            {(Object.keys(careerLabels) as (keyof CareerProfile)[]).map(
              (key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {careerLabels[key]}
                  </label>
                  <input
                    className={inputCls}
                    value={careerDraft[key]}
                    onChange={(e) =>
                      setCareerDraft((d) => ({ ...d, [key]: e.target.value }))
                    }
                  />
                </div>
              ),
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingCareer(false)}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button onClick={saveCareer} className={saveBtnCls}>
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Profile Headline */}
      {editingHeadline && (
        <Modal
          title="Edit Profile Headline"
          onClose={() => setEditingHeadline(false)}
        >
          <div className="space-y-4">
            <textarea
              className={`${inputCls} min-h-[120px] resize-none`}
              value={headlineDraft}
              onChange={(e) => setHeadlineDraft(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingHeadline(false)}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setResumeHeadline(headlineDraft);
                  setEditingHeadline(false);
                }}
                className={saveBtnCls}
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Project */}
      {(addingProject || editingProject) && (
        <Modal
          title={editingProject ? "Edit Project" : "Add Project"}
          onClose={closeProjectModal}
        >
          <div className="space-y-4">
            {(
              [
                { label: "Project Title", key: "title" },
                { label: "Type (e.g. Offsite)", key: "type" },
                {
                  label: "Period (e.g. Jan 2024 to Mar 2024 (Full Time))",
                  key: "period",
                },
              ] as { label: string; key: keyof typeof projectDraft }[]
            ).map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {label}
                </label>
                <input
                  className={inputCls}
                  value={projectDraft[key]}
                  onChange={(e) =>
                    setProjectDraft((d) => ({ ...d, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                className={`${inputCls} min-h-[100px] resize-none`}
                value={projectDraft.desc}
                onChange={(e) =>
                  setProjectDraft((d) => ({ ...d, desc: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeProjectModal} className={cancelBtnCls}>
                Cancel
              </button>
              <button onClick={saveProject} className={saveBtnCls}>
                {editingProject ? "Save Changes" : "Add Project"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Employment */}
      {(addingEmp || editingEmp) && (
        <Modal
          title={editingEmp ? "Edit Employment" : "Add Employment"}
          onClose={closeEmpModal}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Role / Title
              </label>
              <input
                className={inputCls}
                value={empDraft.role}
                placeholder="e.g. Senior Software Engineer"
                onChange={(e) =>
                  setEmpDraft((d) => ({ ...d, role: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Name
              </label>
              <input
                className={inputCls}
                value={empDraft.company}
                placeholder="e.g. TechCorp Inc."
                onChange={(e) =>
                  setEmpDraft((d) => ({ ...d, company: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <MonthYearPicker
                  value={empDraft.startDate}
                  onChange={(v) => setEmpDraft((d) => ({ ...d, startDate: v }))}
                  placeholder="Start month & year"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                {empDraft.current ? (
                  <div className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-400 italic">
                    Present
                  </div>
                ) : (
                  <MonthYearPicker
                    value={empDraft.endDate}
                    onChange={(v) => setEmpDraft((d) => ({ ...d, endDate: v }))}
                    placeholder="End month & year"
                  />
                )}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={empDraft.current}
                onChange={(e) =>
                  setEmpDraft((d) => ({
                    ...d,
                    current: e.target.checked,
                    endDate: e.target.checked ? "Present" : "",
                  }))
                }
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Currently working here
              </span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                className={`${inputCls} min-h-[90px] resize-none`}
                value={empDraft.desc}
                placeholder="Brief description of your role and key achievements..."
                onChange={(e) =>
                  setEmpDraft((d) => ({ ...d, desc: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeEmpModal} className={cancelBtnCls}>
                Cancel
              </button>
              <button onClick={saveEmp} className={saveBtnCls}>
                {editingEmp ? "Save Changes" : "Add Employment"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Education */}
      {(addingEdu || editingEdu) && (
        <Modal
          title={editingEdu ? "Edit Education" : "Add Education"}
          onClose={closeEduModal}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Degree / Qualification
              </label>
              <input
                className={inputCls}
                value={eduDraft.degree}
                placeholder="e.g. M.S. Computer Science"
                onChange={(e) =>
                  setEduDraft((d) => ({ ...d, degree: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Institution / University
              </label>
              <input
                className={inputCls}
                value={eduDraft.institution}
                placeholder="e.g. Stanford University"
                onChange={(e) =>
                  setEduDraft((d) => ({ ...d, institution: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <MonthYearPicker
                  value={eduDraft.startDate}
                  onChange={(v) => setEduDraft((d) => ({ ...d, startDate: v }))}
                  placeholder="Start month & year"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <MonthYearPicker
                  value={eduDraft.endDate}
                  onChange={(v) => setEduDraft((d) => ({ ...d, endDate: v }))}
                  placeholder="End month & year"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeEduModal} className={cancelBtnCls}>
                Cancel
              </button>
              <button onClick={saveEdu} className={saveBtnCls}>
                {editingEdu ? "Save Changes" : "Add Education"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Publication */}
      {(addingPub || editingPub) && (
        <Modal
          title={editingPub ? "Edit Publication" : "Add Publication"}
          onClose={closePubModal}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Publication Title
              </label>
              <input
                className={inputCls}
                value={pubDraft.title}
                placeholder="e.g. Optimizing Microservices for Scale"
                onChange={(e) =>
                  setPubDraft((d) => ({ ...d, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Publisher / Journal
              </label>
              <input
                className={inputCls}
                value={pubDraft.publisher}
                placeholder="e.g. IEEE Software"
                onChange={(e) =>
                  setPubDraft((d) => ({ ...d, publisher: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Publication Date (e.g. Nov 2023)
              </label>
              <input
                className={inputCls}
                value={pubDraft.date}
                placeholder="e.g. Nov 2023"
                onChange={(e) =>
                  setPubDraft((d) => ({ ...d, date: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Publication URL
              </label>
              <input
                className={inputCls}
                value={pubDraft.url}
                placeholder="https://..."
                onChange={(e) =>
                  setPubDraft((d) => ({ ...d, url: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                className={`${inputCls} min-h-[80px] resize-none`}
                value={pubDraft.desc}
                placeholder="Brief summary of the publication..."
                onChange={(e) =>
                  setPubDraft((d) => ({ ...d, desc: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closePubModal} className={cancelBtnCls}>
                Cancel
              </button>
              <button onClick={savePub} className={saveBtnCls}>
                {editingPub ? "Save Changes" : "Add Publication"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Certification */}
      {(addingCert || editingCert) && (
        <Modal
          title={editingCert ? "Edit Certification" : "Add Certification"}
          onClose={closeCertModal}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Certification Name
              </label>
              <input
                className={inputCls}
                value={certDraft.name}
                placeholder="e.g. AWS Certified Solutions Architect"
                onChange={(e) =>
                  setCertDraft((d) => ({ ...d, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Issuing Organization
              </label>
              <input
                className={inputCls}
                value={certDraft.issuer}
                placeholder="e.g. Amazon Web Services"
                onChange={(e) =>
                  setCertDraft((d) => ({ ...d, issuer: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Issue Date
              </label>
              <MonthYearPicker
                value={certDraft.issueDate}
                onChange={(v) => setCertDraft((d) => ({ ...d, issueDate: v }))}
                placeholder="Select issue month & year"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={certDraft.doesExpire}
                onChange={(e) =>
                  setCertDraft((d) => ({
                    ...d,
                    doesExpire: e.target.checked,
                    expiryDate: e.target.checked ? d.expiryDate : "",
                  }))
                }
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                This certification has an expiry date
              </span>
            </label>
            {certDraft.doesExpire && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date
                </label>
                <MonthYearPicker
                  value={certDraft.expiryDate}
                  onChange={(v) =>
                    setCertDraft((d) => ({ ...d, expiryDate: v }))
                  }
                  placeholder="Select expiry month & year"
                />
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeCertModal} className={cancelBtnCls}>
                Cancel
              </button>
              <button onClick={saveCert} className={saveBtnCls}>
                {editingCert ? "Save Changes" : "Add Certification"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Social Links */}
      {editingSocial && (
        <Modal
          title="Edit Social Links"
          onClose={() => setEditingSocial(false)}
        >
          <div className="space-y-4">
            {(
              [
                { label: "LinkedIn Profile URL", key: "linkedin" },
                { label: "GitHub Profile URL", key: "github" },
                { label: "X (Twitter) Profile URL", key: "twitter" },
                { label: "Personal Website URL", key: "website" },
              ] as { label: string; key: keyof SocialLinks }[]
            ).map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {label}
                </label>
                <input
                  className={inputCls}
                  value={socialDraft[key]}
                  onChange={(e) =>
                    setSocialDraft((d) => ({ ...d, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingSocial(false)}
                className={cancelBtnCls}
              >
                Cancel
              </button>
              <button onClick={saveSocial} className={saveBtnCls}>
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
