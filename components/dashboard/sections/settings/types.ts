export interface ProfileHeader {
  name: string;
  title: string;
  location: string;
  experience: string;
  salary: string;
  noticePeriod: string;
  avatarUrl: string | null;
  avatarInitials: string;
}

export interface CareerProfile {
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

export interface Project {
  id: number;
  title: string;
  type: string;
  period: string;
  desc: string;
}

export interface Employment {
  id: number;
  role: string;
  company: string;
  startDate: string; // "MMM YYYY"
  endDate: string; // "MMM YYYY" | "Present"
  current: boolean;
  desc: string;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  startDate: string; // "MMM YYYY"
  endDate: string; // "MMM YYYY"
}

export interface Publication {
  id: number;
  title: string;
  publisher: string;
  date: string;
  url: string;
  desc: string;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  issueDate: string; // "MMM YYYY"
  doesExpire: boolean;
  expiryDate: string; // "MMM YYYY"
}

export interface SocialLinks {
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
}
