import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Platform", href: "/#features" },
  { label: "Roles", href: "/#roles" },
  { label: "Resources", href: "/#resources" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="material-icons text-primary text-3xl mr-2">
              psychology
            </span>
            <span className="font-display font-bold text-xl tracking-tight text-text-light dark:text-text-dark">
              SkillScout
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-primary"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-full transition-all shadow-lg shadow-blue-500/30"
            >
              Start Mock Interview
            </Link>
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/auth/signup"
              className="bg-primary hover:bg-primary-hover text-white text-xs font-medium px-3 py-1.5 rounded-full transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap"
            >
              Start Mock Interview
            </Link>
            <button
              className="p-2 rounded-full text-subtext-light dark:text-subtext-dark hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className="material-icons text-xl">
                {menuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center text-sm font-medium text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-primary transition-colors py-2.5 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
