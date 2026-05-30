import { useState, useEffect } from "react";
import type { InterviewTypeId } from "./data";
import InterviewConfig from "./InterviewConfig";
import SessionPreview from "./SessionPreview";
import ProTip from "./ProTip";
import { paymentsAPI } from "@/lib/api";

export default function PracticeSectionContent() {
  const [interviewType, setInterviewType] =
    useState<InterviewTypeId>("technical");
  const [company, setCompany] = useState("google");
  const [difficulty, setDifficulty] = useState(3);
  const [persona, setPersona] = useState("neutral");
  const [planSlug, setPlanSlug] = useState<string | null>(null);

  useEffect(() => {
    paymentsAPI.getSubscription().then((result) => {
      const slug = result?.data?.plan?.slug ?? null;
      setPlanSlug(slug);
    }).catch(() => {
      // keep planSlug null → defaults to lite tier
    });
  }, []);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Practice Arena
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            Configure your mock interview environment. Choose the type,
            difficulty, and persona to simulate real-world interview conditions.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          AI Services Operational
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <InterviewConfig
          interviewType={interviewType}
          setInterviewType={setInterviewType}
          company={company}
          setCompany={setCompany}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          persona={persona}
          setPersona={setPersona}
        />

        <div className="col-span-12 md:col-span-4 flex flex-col gap-6 h-full">
          <div className="flex-1">
            <SessionPreview interviewType={interviewType} planSlug={planSlug} />
          </div>
          <ProTip />
        </div>
      </div>
    </div>
  );
}
