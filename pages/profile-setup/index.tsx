import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import SetupNav from "@/components/profile-setup/SetupNav";
import SetupProgressBar from "@/components/profile-setup/SetupProgressBar";
import StepResume, {
  PersonalStepData,
} from "@/components/profile-setup/StepResume";
import StepRole, {
  ExperienceStepData,
} from "@/components/profile-setup/StepRole";
import StepSkills, {
  JobLevelStepData,
} from "@/components/profile-setup/StepSkills";
import Step4Skills, {
  SkillsTagsData,
} from "@/components/profile-setup/Step4Skills";
import Step5Review from "@/components/profile-setup/Step5Review";
import { profileAPI } from "@/lib/api";

const STEP_TITLES: Record<number, string> = {
  0: "Let's start with the basics",
  1: "Experience & Skills",
  2: "Job Level & Target Roles",
  3: "Skills & Technologies",
  4: "Review & Finish",
};

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [personalData, setPersonalData] = useState<PersonalStepData>({
    fullName: "",
    careerGoal: "",
    profilePicture: null,
    profilePictureUrl: null,
  });

  const [experienceData, setExperienceData] = useState<ExperienceStepData>({
    resumeFile: null,
    profileHeadline: "",
    education: [],
    employment: [],
    projects: [],
    publications: [],
    certifications: [],
  });

  const [jobLevelData, setJobLevelData] = useState<JobLevelStepData>({
    careerLevel: "",
    targetIndustries: [],
    targetRoles: [],
  });

  const [skillsData, setSkillsData] = useState<SkillsTagsData>({
    techSkills: [],
    socialLinks: { linkedin: "", github: "", twitter: "", website: "" },
  });

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const finish = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const fd = new FormData();
      fd.append("fullName", personalData.fullName);
      fd.append("careerGoal", personalData.careerGoal);
      if (personalData.profilePicture) {
        fd.append("profilePicture", personalData.profilePicture);
      }
      if (experienceData.resumeFile) {
        fd.append("resume", experienceData.resumeFile);
      }
      fd.append("profileHeadline", experienceData.profileHeadline);
      fd.append("careerLevel", jobLevelData.careerLevel);
      if (jobLevelData.targetIndustries.length) {
        jobLevelData.targetIndustries.forEach((ind) =>
          fd.append("targetIndustries[]", ind),
        );
      }
      if (jobLevelData.targetRoles.length) {
        jobLevelData.targetRoles.forEach((role) =>
          fd.append("targetRoles[]", role),
        );
      }
      skillsData.techSkills.forEach((skill) =>
        fd.append("techSkills[]", skill),
      );
      if (experienceData.education.length) {
        fd.append(
          "education",
          JSON.stringify(
            experienceData.education.map(({ id: _id, ...rest }) => rest),
          ),
        );
      }
      if (experienceData.employment.length) {
        fd.append(
          "employment",
          JSON.stringify(
            experienceData.employment.map(({ id: _id, ...rest }) => rest),
          ),
        );
      }
      if (experienceData.projects.length) {
        fd.append(
          "projects",
          JSON.stringify(
            experienceData.projects.map(({ id: _id, ...rest }) => rest),
          ),
        );
      }
      if (experienceData.publications.length) {
        fd.append(
          "publications",
          JSON.stringify(
            experienceData.publications.map(({ id: _id, ...rest }) => rest),
          ),
        );
      }
      if (experienceData.certifications.length) {
        fd.append(
          "certifications",
          JSON.stringify(
            experienceData.certifications.map(({ id: _id, ...rest }) => rest),
          ),
        );
      }
      const sl = skillsData.socialLinks;
      if (sl && Object.values(sl).some((v) => v.trim())) {
        fd.append(
          "socialLinks",
          JSON.stringify({
            linkedin: sl.linkedin ?? "",
            github: sl.github ?? "",
            twitter: sl.twitter ?? "",
            website: sl.website ?? "",
          }),
        );
      }

      await profileAPI.setupProfile(fd);
      router.push("/dashboard");
    } catch (e: unknown) {
      const axiosErr = e as {
        response?: { data?: { error?: { message?: string } } };
        message?: string;
      };
      const msg =
        axiosErr?.response?.data?.error?.message ??
        axiosErr?.message ??
        "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Profile Setup | SkillScout</title>
        <meta
          name="description"
          content="Complete your SkillScout candidate profile."
        />
      </Head>

      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SetupNav />

        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-20">
          <SetupProgressBar currentStep={step} />

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-text-light dark:text-text-dark">
              {STEP_TITLES[step]}
            </h1>
          </div>

          {step === 0 && (
            <StepResume
              data={personalData}
              onChange={setPersonalData}
              onContinue={next}
              onBack={back}
            />
          )}
          {step === 1 && (
            <StepRole
              data={experienceData}
              onChange={setExperienceData}
              onContinue={next}
              onBack={back}
            />
          )}
          {step === 2 && (
            <StepSkills
              data={jobLevelData}
              onChange={setJobLevelData}
              onContinue={next}
              onBack={back}
            />
          )}
          {step === 3 && (
            <Step4Skills
              data={skillsData}
              onChange={setSkillsData}
              jobLevel={jobLevelData}
              onContinue={next}
              onBack={back}
            />
          )}
          {step === 4 && (
            <Step5Review
              personal={personalData}
              experience={experienceData}
              jobLevel={jobLevelData}
              skills={skillsData}
              onFinish={finish}
              onBack={back}
              onGoToStep={setStep}
              submitting={submitting}
              submitError={submitError}
            />
          )}
        </main>
      </div>
    </>
  );
}
