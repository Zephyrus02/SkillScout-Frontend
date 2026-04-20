import Image from "next/image";

interface SetupNavProps {
  userName?: string;
}

export default function SetupNav({ userName }: SetupNavProps) {
  return (
    <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo — non-navigable during setup to prevent wizard bypass */}
          <span className="flex items-center cursor-default select-none">
            <Image
              src="/brandimg.png"
              alt="SkillScout"
              width={160}
              height={32}
              className="h-8 w-auto"
            />
          </span>

          {/* Right side */}
          <div className="flex items-center gap-4">
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
