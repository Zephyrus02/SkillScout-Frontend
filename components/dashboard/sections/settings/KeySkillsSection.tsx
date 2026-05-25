import { useRef, useState, useEffect, useCallback } from "react";
import SKILLS from "@/data/skills";
import { cardCls } from "./constants";
import { useProfile } from "@/hooks/useProfile";
import { profileAPI } from "@/lib/api";

// Debounce helper
function useDebouncedCallback<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    (...args: T) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fn, delay],
  );
}

export default function KeySkillsSection() {
  const { profile: apiProfile } = useProfile();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillQuery, setSkillQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const skillInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (apiProfile?.skills) {
      // This is an intentional sync-from-server effect (not derived state).
      // We only run it when the server snapshot changes.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSkills(apiProfile.skills);
    }
  }, [apiProfile]);

  const persistSkills = useCallback(async (newSkills: string[]) => {
    try {
      await profileAPI.updateSkills(newSkills);
    } catch {
      // silently ignore transient errors
    }
  }, []);

  const debouncedPersist = useDebouncedCallback(persistSkills, 600);

  const filteredSuggestions = skillQuery.trim()
    ? SKILLS.filter((s) =>
        s.toLowerCase().includes(skillQuery.toLowerCase()),
      ).slice(0, 10)
    : [];

  const addSkill = (s: string) => {
    const trimmed = s.trim();
    if (trimmed && !skills.includes(trimmed)) {
      const next = [...skills, trimmed];
      setSkills(next);
      debouncedPersist(next);
    }
    setSkillQuery("");
    setShowDropdown(false);
  };

  const removeSkill = (skill: string) => {
    const next = skills.filter((s) => s !== skill);
    setSkills(next);
    debouncedPersist(next);
  };

  return (
    <div id="key-skills" className={cardCls}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Key Skills
        </h2>
      </div>

      {/* Input + autocomplete */}
      <div className="mb-5" ref={dropdownRef}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={skillInputRef}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              placeholder="Search or type a skill..."
              value={skillQuery}
              onChange={(e) => {
                setSkillQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addSkill(skillQuery);
                }
              }}
            />
            {skillQuery && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setSkillQuery("");
                  setShowDropdown(false);
                }}
              >
                <span className="material-icons text-sm">close</span>
              </button>
            )}

              {/* Autocomplete dropdown */}
              {showDropdown && filteredSuggestions.length > 0 && (
                <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                  {filteredSuggestions.map((s) => {
                    const alreadyAdded = skills.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={alreadyAdded}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition ${
                          alreadyAdded
                            ? "text-gray-400 dark:text-gray-600 cursor-default bg-gray-50 dark:bg-gray-800/50"
                            : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"
                        }`}
                        onMouseDown={(e) => {
                          if (alreadyAdded) return;
                          e.preventDefault();
                          addSkill(s);
                        }}
                      >
                        <span>{s}</span>
                        {alreadyAdded && (
                          <span className="material-icons text-sm text-green-500">
                            check
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
          </div>
          <button
            type="button"
            onClick={() => addSkill(skillQuery)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </div>

      {/* Skills chips */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 group"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-0.5 text-gray-400 hover:text-red-500 transition leading-none"
            >
              <span className="material-icons text-xs">close</span>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
