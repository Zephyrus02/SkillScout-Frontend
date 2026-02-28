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

  const [personalData, setPersonalData] = useState<PersonalStepData>({
    fullName: "",
    preferredTitle: "",
    careerGoal: "",
  });

  const [experienceData, setExperienceData] = useState<ExperienceStepData>({
    resumeFile: null,
    targetRole: "",
    industry: "",
    yearsOfExp: "",
    topSkills: [],
  });

  const [jobLevelData, setJobLevelData] = useState<JobLevelStepData>({
    careerLevel: "",
    targetRoles: [],
    customRole: "",
  });

  const [skillsData, setSkillsData] = useState<SkillsTagsData>({
    techSkills: [],
    softSkills: [],
  });

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const finish = () => router.push("/dashboard");

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
            />
          )}
        </main>
      </div>
    </>
  );
}
