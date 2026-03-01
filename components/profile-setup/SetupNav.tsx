import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

interface SetupNavProps {
  userName?: string;
}

export default function SetupNav({ userName }: SetupNavProps) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/brandimg.png"
              alt="SkillScout"
              width={160}
              height={32}
              className="h-8 w-auto"
            />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-subtext-light dark:text-subtext-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              <span className="material-icons text-xl">
                {darkMode ? "light_mode" : "dark_mode"}
              </span>
            </button>

            {userName && (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-text-light dark:text-text-dark hidden sm:block">
                  {userName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
