import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS: Record<string, Array<{ label: string; href: string }>> = {
  Platform: [
    { label: "Mock Interviews", href: "#" },
    { label: "System Design", href: "#" },
    { label: "Coding Challenges", href: "#" },
    { label: "Behavioral Prep", href: "#" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "/resources" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Interview Guide", href: "#" },
    { label: "Salary Negotiation", href: "#" },
    { label: "Resume Review", href: "#" },
    { label: "FAQ", href: "/resources#faq" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/legal/terms-of-service" },
    { label: "Privacy Policy", href: "/legal/privacy-policy" },
    { label: "Refund Policy", href: "/legal/refund-policy" },
    { label: "Shipping Policy", href: "/legal/shipping-policy" },
  ],
};

const SOCIAL_ICONS = [
  { icon: "camera_alt", label: "Instagram" },
  { icon: "alternate_email", label: "Twitter" },
  { icon: "work", label: "LinkedIn" },
];

const LEGAL_LINKS: Array<{ label: string; href: string }> = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms of Service", href: "/legal/terms-of-service" },
  { label: "Refund Policy", href: "/legal/refund-policy" },
  { label: "Shipping Policy", href: "/legal/shipping-policy" },
];

export default function Footer() {
  return (
    <footer className="bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <Image
                src="/brandimg.png"
                alt="SkillScout"
                width={160}
                height={32}
                className="h-7 w-auto"
              />
            </div>
            <p className="text-sm text-subtext-light dark:text-subtext-dark mb-6">
              The only AI-powered interview preparation platform every software
              engineer needs.
            </p>
            <div className="flex space-x-4">
              {SOCIAL_ICONS.map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  <span className="material-icons text-xl">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-bold text-text-light dark:text-text-dark mb-4">
                {heading}
              </h4>
              <ul className="space-y-2 text-sm text-subtext-light dark:text-subtext-dark">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-subtext-light dark:text-subtext-dark">
          <p>© 2026 SkillScout Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="hover:text-text-light dark:hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
