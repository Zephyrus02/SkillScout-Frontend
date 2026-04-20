import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

const NAV_LINKS = [
  { label: "Platform", href: "/#features" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setProfileDropdownOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDashboardClick = () => {
    setProfileDropdownOpen(false);
    setMenuOpen(false);
    if (user && !user.onboardingCompleted) {
      router.push("/profile-setup");
    } else {
      router.push("/dashboard");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <nav className="fixed w-full z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/brandimg.svg"
              alt="SkillScout"
              width={160}
              height={32}
              className="h-8 w-auto"
              priority
              sizes="160px"
            />
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
          <div className="hidden md:flex items-center space-x-4 min-w-[200px] justify-end">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  aria-label="User menu"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-9 w-9 rounded-full border-2 border-primary object-cover"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold border-2 border-primary">
                      {getInitials(user.name)}
                    </div>
                  )}
                </button>

                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={handleDashboardClick}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="material-icons text-lg mr-3">
                          dashboard
                        </span>
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="material-icons text-lg mr-3">
                          logout
                        </span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center space-x-2 min-w-[120px] justify-end">
            {isAuthenticated && user ? (
              <>
                <div className="relative" ref={mobileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex h-12 w-12 items-center justify-center"
                    aria-label="User menu"
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-8 w-8 rounded-full border-2 border-primary object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold border-2 border-primary">
                        {getInitials(user.name)}
                      </div>
                    )}
                  </button>

                  {/* Mobile profile dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        <button
                          onClick={handleDashboardClick}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="material-icons text-lg mr-3">
                            dashboard
                          </span>
                          Dashboard
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="material-icons text-lg mr-3">
                            logout
                          </span>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className="h-12 w-12 rounded-full text-subtext-light dark:text-subtext-dark hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle menu"
                >
                  <span className="material-icons text-xl">
                    {menuOpen ? "close" : "menu"}
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold h-12 px-4 rounded-full transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap inline-flex items-center"
                >
                  Start Mock Interview
                </Link>
                <button
                  className="h-12 w-12 rounded-full text-subtext-light dark:text-subtext-dark hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle menu"
                >
                  <span className="material-icons text-xl">
                    {menuOpen ? "close" : "menu"}
                  </span>
                </button>
              </>
            )}
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

          {/* Auth section for mobile */}
          {isAuthenticated && user ? (
            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-800 space-y-1">
              <button
                onClick={handleDashboardClick}
                className="flex items-center w-full text-sm font-medium text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-primary transition-colors py-2.5 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60"
              >
                <span className="material-icons text-lg mr-3">dashboard</span>
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-sm font-medium text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-primary transition-colors py-2.5 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60"
              >
                <span className="material-icons text-lg mr-3">logout</span>
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-800">
              <Link
                href="/auth/login"
                className="flex items-center text-sm font-medium text-subtext-light dark:text-subtext-dark hover:text-primary dark:hover:text-primary transition-colors py-2.5 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
