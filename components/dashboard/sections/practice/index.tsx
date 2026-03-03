import { useState } from "react";
import type { InterviewTypeId } from "./data";
import InterviewConfig from "./InterviewConfig";
import SessionPreview from "./SessionPreview";
import ProTip from "./ProTip";

export default function PracticeSectionContent() {
  const [interviewType, setInterviewType] =
    useState<InterviewTypeId>("technical");
  const [company, setCompany] = useState("google");
  const [difficulty, setDifficulty] = useState(3);
  const [duration, setDuration] = useState(45);
  const [persona, setPersona] = useState("neutral");

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
          duration={duration}
          setDuration={setDuration}
          persona={persona}
          setPersona={setPersona}
        />

        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
          <SessionPreview duration={duration} />
          <ProTip />
        </div>
      </div>
    </div>
  );
}
