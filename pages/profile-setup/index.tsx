import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
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
import Step5PlanSelect, {
  PlanId,
} from "@/components/profile-setup/Step5PlanSelect";
import Step5Review from "@/components/profile-setup/Step5Review";
import { profileAPI, onboardingAPI } from "@/lib/api";

const STEP_TITLES: Record<number, string> = {
  0: "Let's start with the basics",
  1: "Experience, Background & Preferences",
  2: "Job Level & Target Roles",
  3: "Skills & Technologies",
  4: "Choose Your Plan",
  5: "Review & Finish",
};

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>("trial");

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
    currentLocation: "",
    preferredLocation: "",
    preferredShift: "",
    expectedSalary: "",
    desiredWorkType: "",
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

  const saveProgressToBackend = useCallback(
    async (updates: {
      step?: number;
      personalData?: PersonalStepData;
      experienceData?: ExperienceStepData;
      jobLevelData?: JobLevelStepData;
      skillsData?: SkillsTagsData;
      selectedPlan?: PlanId | null;
      paymentStatus?: string | null;
    }) => {
      try {
        const draftData: Record<string, unknown> = {};
        if (updates.personalData) {
          draftData.personalData = {
            fullName: updates.personalData.fullName,
            careerGoal: updates.personalData.careerGoal,
            profilePictureUrl: updates.personalData.profilePictureUrl,
          };
        }
        if (updates.experienceData) {
          const ex = updates.experienceData;
          draftData.experienceData = {
            profileHeadline: ex.profileHeadline,
            education: ex.education,
            employment: ex.employment,
            projects: ex.projects,
            publications: ex.publications,
            certifications: ex.certifications,
            currentLocation: ex.currentLocation,
            preferredLocation: ex.preferredLocation,
            preferredShift: ex.preferredShift,
            expectedSalary: ex.expectedSalary,
            desiredWorkType: ex.desiredWorkType,
            resumeUrl: ex.resumeUrl,
            resumeFileName: ex.resumeFileName,
          };
        }
        if (updates.jobLevelData) {
          draftData.jobLevelData = updates.jobLevelData;
        }
        if (updates.skillsData) {
          draftData.skillsData = updates.skillsData;
        }
        await onboardingAPI.saveProgress({
          flowType: "candidate",
          currentStep: updates.step ?? step,
          draftData: Object.keys(draftData).length ? draftData : undefined,
          selectedPlan: updates.selectedPlan ?? selectedPlan,
          paymentStatus: updates.paymentStatus,
        });
      } catch {
        // Non-blocking; progress save failures don't block user
      }
    },
    [step, selectedPlan],
  );

  const next = async () => {
    await saveProgressToBackend({
      step: Math.min(step + 1, 5),
      personalData,
      experienceData,
      jobLevelData,
      skillsData,
      selectedPlan,
    });
    setStep((s) => Math.min(s + 1, 5));
  };

  const back = async () => {
    await saveProgressToBackend({
      step: Math.max(step - 1, 0),
      personalData,
      experienceData,
      jobLevelData,
      skillsData,
      selectedPlan,
    });
    setStep((s) => Math.max(s - 1, 0));
  };

  // Load progress on mount
  const [progressLoaded, setProgressLoaded] = useState(false);
  useEffect(() => {
    let cancelled = false;
    onboardingAPI
      .getProgress()
      .then((res) => {
        if (!cancelled && res.success && res.data) {
          const d = res.data;
          if (d.hasAccess) {
            router.replace("/dashboard");
            return;
          }
          if (d.draftData) {
            const dd = d.draftData as Record<string, unknown>;
            if (dd.personalData) {
              const p = dd.personalData as Record<string, unknown>;
              setPersonalData((prev) => ({
                ...prev,
                fullName: (p.fullName as string) ?? prev.fullName,
                careerGoal: (p.careerGoal as string) ?? prev.careerGoal,
                profilePictureUrl:
                  (p.profilePictureUrl as string) ?? prev.profilePictureUrl,
              }));
            }
            if (dd.experienceData) {
              const e = dd.experienceData as Record<string, unknown>;
              setExperienceData((prev) => ({
                ...prev,
                profileHeadline:
                  (e.profileHeadline as string) ?? prev.profileHeadline,
                education:
                  (e.education as ExperienceStepData["education"]) ??
                  prev.education,
                employment:
                  (e.employment as ExperienceStepData["employment"]) ??
                  prev.employment,
                projects:
                  (e.projects as ExperienceStepData["projects"]) ??
                  prev.projects,
                publications:
                  (e.publications as ExperienceStepData["publications"]) ??
                  prev.publications,
                certifications:
                  (e.certifications as ExperienceStepData["certifications"]) ??
                  prev.certifications,
                currentLocation:
                  (e.currentLocation as string) ?? prev.currentLocation,
                preferredLocation:
                  (e.preferredLocation as string) ?? prev.preferredLocation,
                preferredShift:
                  (e.preferredShift as string) ?? prev.preferredShift,
                expectedSalary:
                  (e.expectedSalary as string) ?? prev.expectedSalary,
                desiredWorkType:
                  (e.desiredWorkType as string) ?? prev.desiredWorkType,
                resumeUrl: (e.resumeUrl as string) ?? prev.resumeUrl,
                resumeFileName:
                  (e.resumeFileName as string) ?? prev.resumeFileName,
              }));
            }
            if (dd.jobLevelData) {
              const jl = dd.jobLevelData as Partial<JobLevelStepData>;
              setJobLevelData((prev) => ({
                careerLevel: jl.careerLevel ?? prev.careerLevel,
                targetIndustries: jl.targetIndustries ?? prev.targetIndustries,
                targetRoles: jl.targetRoles ?? prev.targetRoles,
              }));
            }
            if (dd.skillsData) {
              const sl = dd.skillsData as Partial<SkillsTagsData>;
              setSkillsData((prev) => ({
                techSkills: sl.techSkills ?? prev.techSkills,
                socialLinks: sl.socialLinks ?? prev.socialLinks,
              }));
            }
          }
          if (d.currentStep >= 0 && d.currentStep <= 5) {
            setStep(d.currentStep);
          }
          if (d.selectedPlan) {
            const plan = d.selectedPlan as string;
            setSelectedPlan((plan === "free" ? "lite" : plan) as PlanId);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setProgressLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  // Save selectedPlan when it changes
  useEffect(() => {
    if (!progressLoaded) return;
    if (step === 4 && selectedPlan) {
      saveProgressToBackend({ selectedPlan });
    }
  }, [selectedPlan, step, progressLoaded, saveProgressToBackend]);

  const handlePaymentComplete = useCallback(
    (status: "completed" | "skipped") => {
      saveProgressToBackend({ paymentStatus: status });
    },
    [saveProgressToBackend],
  );

  const handleUploadPicture = useCallback(async (file: File) => {
    const fd = new FormData();
    fd.append("profilePicture", file);
    const res = await onboardingAPI.uploadFile(fd);
    if (!res.success || !res.data?.profilePictureUrl) {
      throw new Error("Upload failed");
    }
    return { url: res.data.profilePictureUrl };
  }, []);

  const handleUploadResume = useCallback(async (file: File) => {
    const fd = new FormData();
    fd.append("resume", file);
    const res = await onboardingAPI.uploadFile(fd);
    if (!res.success || !res.data?.resumeUrl) {
      throw new Error("Upload failed");
    }
    return {
      url: res.data.resumeUrl,
      fileName: res.data.resumeFileName ?? file.name,
    };
  }, []);

  const finish = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const fd = new FormData();
      fd.append("fullName", personalData.fullName);
      fd.append("careerGoal", personalData.careerGoal);
      if (personalData.profilePicture) {
        fd.append("profilePicture", personalData.profilePicture);
      } else if (personalData.profilePictureUrl) {
        fd.append("profilePictureUrl", personalData.profilePictureUrl);
      }
      if (experienceData.resumeFile) {
        fd.append("resume", experienceData.resumeFile);
      } else if (experienceData.resumeUrl) {
        fd.append("resumeUrl", experienceData.resumeUrl);
        if (experienceData.resumeFileName) {
          fd.append("resumeFileName", experienceData.resumeFileName);
        }
      }
      fd.append("profileHeadline", experienceData.profileHeadline);
      fd.append("careerLevel", jobLevelData.careerLevel);
      if (selectedPlan) fd.append("plan", selectedPlan);
      if (experienceData.currentLocation)
        fd.append("currentLocation", experienceData.currentLocation);
      if (experienceData.preferredLocation)
        fd.append("preferredLocation", experienceData.preferredLocation);
      if (experienceData.preferredShift)
        fd.append("preferredShift", experienceData.preferredShift);
      if (experienceData.expectedSalary)
        fd.append("expectedSalary", `${experienceData.expectedSalary} LPA`);
      if (experienceData.desiredWorkType)
        fd.append("desiredWorkType", experienceData.desiredWorkType);
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
            experienceData.education.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ id, ...rest }) => rest,
            ),
          ),
        );
      }
      if (experienceData.employment.length) {
        fd.append(
          "employment",
          JSON.stringify(
            experienceData.employment.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ id, ...rest }) => ({
                ...rest,
                salary: rest.salary ? `${rest.salary} LPA` : rest.salary,
              }),
            ),
          ),
        );
      }
      if (experienceData.projects.length) {
        fd.append(
          "projects",
          JSON.stringify(
            experienceData.projects.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ id, ...rest }) => rest,
            ),
          ),
        );
      }
      if (experienceData.publications.length) {
        fd.append(
          "publications",
          JSON.stringify(
            experienceData.publications.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ id, ...rest }) => rest,
            ),
          ),
        );
      }
      if (experienceData.certifications.length) {
        fd.append(
          "certifications",
          JSON.stringify(
            experienceData.certifications.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ id, ...rest }) => rest,
            ),
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
      await onboardingAPI.clearProgress();
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
        <meta name="robots" content="noindex, nofollow" />

        <title>Profile Setup | SkillScout</title>
        <meta
          name="description"
          content="Complete your SkillScout candidate profile."
        />
      </Head>

      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SetupNav />

        {!progressLoaded && (
          <div className="flex items-center justify-center min-h-[40vh]">
            <span className="material-icons animate-spin text-4xl text-primary">
              refresh
            </span>
          </div>
        )}

        {progressLoaded && (
          <main
            className={`${step === 4 ? "max-w-6xl" : "max-w-3xl"} mx-auto px-4 sm:px-6 py-10 pb-20 transition-all duration-300`}
          >
            <div className={step === 4 || step === 5 ? "max-w-3xl" : ""}>
              <SetupProgressBar currentStep={step} />

              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-text-light dark:text-text-dark">
                  {STEP_TITLES[step]}
                </h1>
              </div>
            </div>

            {step === 0 && (
              <StepResume
                data={personalData}
                onChange={setPersonalData}
                onContinue={next}
                onBack={back}
                onUploadPicture={handleUploadPicture}
              />
            )}
            {step === 1 && (
              <StepRole
                data={experienceData}
                onChange={setExperienceData}
                onContinue={next}
                onBack={back}
                onUploadResume={handleUploadResume}
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
              <Step5PlanSelect
                selectedPlan={selectedPlan}
                onSelectPlan={setSelectedPlan}
                onContinue={next}
                onBack={back}
                onPaymentComplete={handlePaymentComplete}
              />
            )}
            {step === 5 && (
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
        )}
      </div>
    </>
  );
}
