/**
 * Settings Section
 *
 * Composed of granular sub-components, each owning their own state.
 * To add a new section, create a component in this folder and drop
 * it into the appropriate layout slot below.
 *
 * Folder structure:
 *   settings/
 *   ├── types.ts                  – Shared TypeScript interfaces
 *   ├── constants.ts              – Shared Tailwind class strings
 *   ├── ProfileHeaderSection.tsx  – Hero card + avatar upload
 *   ├── CareerProfileSection.tsx  – Career preferences grid
 *   ├── ResumeSection.tsx         – Resume file + profile headline
 *   ├── ProjectsSection.tsx       – Projects list + CRUD modal
 *   ├── KeySkillsSection.tsx      – Skills chips + autocomplete
 *   ├── EmploymentSection.tsx     – Timeline + CRUD modal
 *   ├── EducationSection.tsx      – Timeline + CRUD modal
 *   ├── PublicationsSection.tsx   – Publications cards + CRUD modal
 *   ├── CertificationsSection.tsx – Certification cards + CRUD modal
 *   ├── SidebarQuickLinks.tsx     – Sidebar anchor links
 *   ├── SidebarSocialLinks.tsx    – Sidebar social links + edit modal
 *   ├── SidebarBillingUsage.tsx   – Billing, usage, invoices, upgrade
 *   └── SidebarAccountSettings.tsx – Email alerts, change password, delete
 */

import { useEffect } from "react";
import ProfileHeaderSection from "./ProfileHeaderSection";
import CareerProfileSection from "./CareerProfileSection";
import ResumeSection from "./ResumeSection";
import ProjectsSection from "./ProjectsSection";
import KeySkillsSection from "./KeySkillsSection";
import EmploymentSection from "./EmploymentSection";
import EducationSection from "./EducationSection";
import PublicationsSection from "./PublicationsSection";
import CertificationsSection from "./CertificationsSection";
import SidebarQuickLinks from "./SidebarQuickLinks";
import SidebarSocialLinks from "./SidebarSocialLinks";
import SidebarBillingUsage from "./SidebarBillingUsage";
import SidebarAccountSettings from "./SidebarAccountSettings";

export default function SettingsSection() {
  useEffect(() => {
    const runHighlight = (hash: string) => {
      const targetId = hash.replace("#", "");
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;

      target.classList.remove("section-glow");
      void target.offsetWidth;
      target.classList.add("section-glow");
      window.setTimeout(() => {
        target.classList.remove("section-glow");
      }, 1200);
    };

    const handleHashChange = () => runHighlight(window.location.hash);
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Profile Hero ──────────────────────────────────────────────── */}
      <ProfileHeaderSection />

      {/* ── Main Grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6">
        {/* ── Sidebar ─────────────────────────────────── col-span-3 ── */}
        <div className="col-span-12 lg:col-span-3 order-last lg:order-last space-y-6">
          <SidebarQuickLinks />
          <SidebarSocialLinks />
          <SidebarBillingUsage />
          <SidebarAccountSettings />
        </div>

        {/* ── Main Content ────────────────────────────── col-span-9 ── */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <CareerProfileSection />
          <ResumeSection />
          <ProjectsSection />
          <KeySkillsSection />

          {/* Employment + Education side-by-side on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmploymentSection />
            <EducationSection />
          </div>

          {/* Publications + Certifications side-by-side on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PublicationsSection />
            <CertificationsSection />
          </div>
        </div>
      </div>
    </div>
  );
}
