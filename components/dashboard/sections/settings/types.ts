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
  primaryCareerGoal: string;
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
  id: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  desc: string;
}

export interface Employment {
  id: string;
  role: string;
  company: string;
  startDate: string; // "MMM YYYY"
  endDate: string; // "MMM YYYY" | "Present"
  current: boolean;
  desc: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string; // "MMM YYYY"
  endDate: string; // "MMM YYYY" | "Present"
  current: boolean;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
  desc: string;
}

export interface Certification {
  id: string;
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
