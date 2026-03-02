import Link from "next/link";
import Image from "next/image";
import { AvatarCircles } from "@/components/ui/avatar-circles";

const avatarUrls = [
  "https://avatars.githubusercontent.com/u/16860528",
  "https://avatars.githubusercontent.com/u/20110627",
  "https://avatars.githubusercontent.com/u/106103625",
  "https://avatars.githubusercontent.com/u/59228569",
];

const BG_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBOvmu6uxxz9dUtZ1hRUzPSDhF6_yHWytZFZUmuiscefTBqz0OsgxOQk2EXrXwS_zkXbK4Wg84KoprB3bp7e6SAFcxP3v6_rTsotuqiGRWneJ-bkOfPpl1D4YTD6X3s-BuQl0agPystkoF6GqYzTGWwdUVM_eSU0jKUeK0ivq--GS1p51FjBRT1CzpKsnguItr_omaHByGeAw7fPjlHb9ucWUgiOFMHAw335bF3iK1shbegag-1UIXBTYUaCARJ_TDDSdsSU4fU8t76";

export default function AuthBranding() {
  return (
    <div className="relative w-full lg:w-1/2 bg-blue-50 dark:bg-slate-900 flex flex-col justify-between p-8 lg:p-12 xl:p-16 order-last lg:order-first min-h-[280px] lg:min-h-screen">
      {/* Background image (desktop only) */}
      <div className="absolute inset-0 z-0 opacity-100 lg:block hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-blue-900/40 mix-blend-multiply z-10" />
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${BG_IMAGE}')` }}
          aria-hidden="true"
        />
      </div>

      {/* Mobile logo */}
      <div className="lg:hidden w-full flex items-center mb-8 relative z-10">
        <Image
          src="/brandimg.png"
          alt="SkillScout"
          width={160}
          height={32}
          className="h-8 w-auto"
        />
      </div>

      {/* Desktop content */}
      <div className="relative z-20 hidden lg:flex flex-col h-full justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center group hover:opacity-90 transition-opacity"
        >
          <Image
            src="/brandimg.png"
            alt="SkillScout"
            width={180}
            height={36}
            className="h-9 w-auto drop-shadow-sm brightness-0 invert"
          />
        </Link>

        {/* Tagline block */}
        <div className="flex flex-col gap-6 max-w-lg">
          <div className="w-12 h-1 bg-primary rounded-full" />
          <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-md font-display">
            Ace Your Next Interview
          </h1>
          <p className="text-blue-50 text-lg font-medium leading-relaxed drop-shadow-sm">
            Practice with AI, get instant feedback, and land your dream job
            faster. Join thousands of candidates improving their skills today.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
            <AvatarCircles avatarUrls={avatarUrls} numPeople={99} />
          </div>
        </div>

        {/* Footer links */}
        <div className="flex gap-6 text-sm text-blue-100/80 font-medium">
          <Link
            href="/legal/terms-of-service"
            className="hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/legal/privacy-policy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
