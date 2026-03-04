import { useRef, useState, type ChangeEvent } from "react";

const CAREER_GOALS = [
  {
    value: "placement",
    label: "Land my first job & transition into the corporate world",
  },
  { value: "transition", label: "Transition into a new industry" },
  { value: "promotion", label: "Get promoted in current role" },
  { value: "freelance", label: "Start a freelance career" },
  { value: "upskill", label: "Upskill for current market trends" },
  { value: "leadership", label: "Step into a leadership position" },
];

export interface PersonalStepData {
  fullName: string;
  careerGoal: string;
  profilePicture: File | null;
  profilePictureUrl: string | null;
}

interface StepResumeProps {
  data: PersonalStepData;
  onChange: (data: PersonalStepData) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function StepResume({
  data,
  onChange,
  onContinue,
  onBack,
}: StepResumeProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof PersonalStepData, string>>
  >({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof PersonalStepData>(
    k: K,
    v: PersonalStepData[K],
  ) => onChange({ ...data, [k]: v });

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({ ...data, profilePicture: file, profilePictureUrl: url });
    }
  };

  const removePicture = () => {
    if (data.profilePictureUrl) URL.revokeObjectURL(data.profilePictureUrl);
    onChange({ ...data, profilePicture: null, profilePictureUrl: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!data.fullName.trim()) e.fullName = "Full name is required.";
    if (!data.careerGoal) e.careerGoal = "Please select a career goal.";
    return e;
  };

  const handleContinue = () => {
    const e = validate();
    setErrors(e);
    if (!Object.keys(e).length) onContinue();
  };

  const inputCls = (err?: string) =>
    `w-full pl-12 pr-4 py-4 rounded-xl border ${err ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-700"} bg-slate-50 dark:bg-gray-800 text-text-light dark:text-text-dark placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm`;

  return (
    <div>
      <p className="text-base text-subtext-light dark:text-subtext-dark mb-8 max-w-xl">
        Tell us about yourself so we can tailor your career journey and find the
        best matches for your expertise.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main form card */}
        <div className="md:col-span-2 bg-white dark:bg-surface-dark p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
          {/* Profile picture */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-light dark:text-text-dark ml-1">
              Profile Picture{" "}
              <span className="text-subtext-light dark:text-subtext-dark font-normal">
                (optional)
              </span>
            </label>
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0">
                {data.profilePictureUrl ? (
                  <img
                    src={data.profilePictureUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-700 dark:to-gray-600 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                    <span className="material-icons text-subtext-light text-3xl">
                      person
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePictureChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-text-light dark:text-text-dark text-sm font-semibold hover:border-primary hover:text-primary transition-all"
                >
                  <span className="material-icons text-[16px]">upload</span>
                  {data.profilePictureUrl ? "Change Photo" : "Upload Photo"}
                </button>
                {data.profilePictureUrl && (
                  <button
                    type="button"
                    onClick={removePicture}
                    className="text-xs text-red-500 hover:underline text-left font-medium"
                  >
                    Remove
                  </button>
                )}
                <p className="text-xs text-subtext-light dark:text-subtext-dark">
                  JPG, PNG or WebP · Max 5 MB
                </p>
              </div>
            </div>
          </div>

          {/* Full name */}
          <div className="flex flex-col gap-1.5 group">
            <label className="text-sm font-semibold text-text-light dark:text-text-dark ml-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-subtext-light group-focus-within:text-primary transition-colors text-[20px]">
                person
              </span>
              <input
                type="text"
                placeholder="e.g. Alex Rivera"
                value={data.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                className={inputCls(errors.fullName)}
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-red-500 ml-1">{errors.fullName}</p>
            )}
          </div>

          {/* Career goal */}
          <div className="flex flex-col gap-1.5 group">
            <label className="text-sm font-semibold text-text-light dark:text-text-dark ml-1">
              Primary Career Goal <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-subtext-light group-focus-within:text-primary transition-colors text-[20px] pointer-events-none">
                flag
              </span>
              <select
                value={data.careerGoal}
                onChange={(e) => set("careerGoal", e.target.value)}
                className={`appearance-none ${inputCls(errors.careerGoal)} cursor-pointer pr-10`}
              >
                <option value="">Select your goal</option>
                {CAREER_GOALS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
              <span className="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-subtext-light pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
            {errors.careerGoal && (
              <p className="text-xs text-red-500 ml-1">{errors.careerGoal}</p>
            )}
          </div>
        </div>

        {/* Pro tip */}
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-6 rounded-xl flex items-start gap-4">
          <div className="bg-primary/20 p-2 rounded-lg text-primary flex-shrink-0">
            <span className="material-icons text-[20px]">lightbulb</span>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-1 text-sm">Pro Tip</h4>
            <p className="text-sm text-subtext-light dark:text-subtext-dark leading-relaxed">
              Picking the goal that best describes you helps our AI personalise
              your entire career journey.
            </p>
          </div>
        </div>

        {/* Social proof */}
        <div className="bg-slate-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 p-6 rounded-xl flex items-center gap-4">
          <div className="flex -space-x-3 flex-shrink-0">
            {[
              "\u{1F469}\u200D\u{1F4BB}",
              "\u{1F468}\u200D\u{1F4BC}",
              "\u{1F469}\u200D\u{1F52C}",
            ].map((e, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm"
              >
                {i === 0 ? "👩‍💻" : i === 1 ? "👨‍💼" : "👩‍🔬"}
              </div>
            ))}
          </div>
          <p className="text-sm text-subtext-light dark:text-subtext-dark font-medium">
            Join 12k+ professionals finding their path today.
          </p>
        </div>

        {/* Nav */}
        <div className="md:col-span-2 flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-xl font-semibold text-subtext-light dark:text-subtext-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
          >
            <span className="material-icons text-sm">arrow_back</span> Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95 text-sm"
          >
            Continue to Step 2{" "}
            <span className="material-icons">arrow_forward</span>
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-subtext-light dark:text-subtext-dark mt-8">
        Your information is secure. We use this to curate your personalized
        experience.
      </p>
    </div>
  );
}
