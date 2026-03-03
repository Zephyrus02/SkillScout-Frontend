export type Plan = "Free" | "Pro" | "Enterprise";
export type Status = "Active" | "Inactive" | "Suspended";

export interface UserTableRow {
  name: string;
  email: string;
  plan: Plan;
  interviews: string;
  score: string;
  scoreClass: string;
  status: Status;
  statusDot: string;
  avatar?: string;
  avatarImage?: string;
  avatarClass: string;
}

export const PLAN_STYLES: Record<Plan, string> = {
  Free: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  Pro: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Enterprise:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
};

export const tableRows: readonly UserTableRow[] = [
  {
    name: "Alex Chen",
    email: "alex.chen@example.com",
    plan: "Free",
    interviews: "14",
    score: "8.5",
    scoreClass: "text-green-500",
    status: "Active",
    statusDot: "bg-green-500",
    avatar: "AC",
    avatarClass: "bg-blue-100 text-primary",
  },
  {
    name: "Sarah Miller",
    email: "sarah.m@techpro.com",
    plan: "Pro",
    interviews: "42",
    score: "9.2",
    scoreClass: "text-green-500",
    status: "Active",
    statusDot: "bg-green-500",
    avatarImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlxdT5lpn3iZ3GcSh28hY_lgCxg29fxRCq5yzwaeA9A8eBAUHnMhlanXh7AcgOVrKUkqFyzMXEvwZ2cGOXV3_Q4-LQNiFkDgSaWYiOCRACjEvd-ymOFrUGxKQYFvFCwoKDA1jla9O8dYLXPjg7C-KxIuOfEKEkbz4aN7g6pHlXn1nYJa7HPM8VYtIX3vWybc-T_ImgsPabvshj-YnGeXslVmiVdrgO75Y8rIIAeQ7No0TIf__KcgghjGilaU5Jhom3qB9fQlqq1AR5",
    avatarClass: "bg-purple-100 text-purple-600",
  },
  {
    name: "James Doe",
    email: "j.doe@university.edu",
    plan: "Free",
    interviews: "2",
    score: "6.8",
    scoreClass: "text-yellow-500",
    status: "Inactive",
    statusDot: "bg-gray-300",
    avatar: "JD",
    avatarClass: "bg-yellow-100 text-yellow-700",
  },
  {
    name: "Emily Zhang",
    email: "emily.z@startup.io",
    plan: "Enterprise",
    interviews: "28",
    score: "9.5",
    scoreClass: "text-green-500",
    status: "Active",
    statusDot: "bg-green-500",
    avatarImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBz_461xti_MyG7tvkMeelqSH4CNteggTOsafeSr5d6ntz7clRbaEC94TJr9TY4sOpUMxGjYYsNstOUkq9lWqrmtfQuXHPJXXO80xj5jd911qE9J4qkAQexTWJox5Gnh_BVm-qNv88rW77rZP-vutMAh4bu-Duy3FiDM9LhhcmZPVbVmsGJpN9ZFeOiGcKL1feq9b6H2exOj_wvXtSD6qtXdVuRgwyOUdcHKNFgDmkDN1nRNJihFg9fUg5bUEQAli8hSxo2KFETBHIC",
    avatarClass: "bg-indigo-100 text-indigo-700",
  },
  {
    name: "Marcus Reed",
    email: "marcus.r@mail.com",
    plan: "Free",
    interviews: "0",
    score: "-",
    scoreClass: "text-gray-400",
    status: "Suspended",
    statusDot: "bg-red-500",
    avatar: "MR",
    avatarClass: "bg-red-100 text-red-600",
  },
];
