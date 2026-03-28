import type { SimpleIcon } from "simple-icons";
import { siAmazon, siMeta, siNetflix } from "simple-icons";

/**
 * Renders a Simple Icons brand mark (https://simpleicons.org — CC0).
 * Decorative next to the card label; button text names the company.
 */
function BrandMark({
  icon,
  className = "w-8 h-8",
}: {
  icon: SimpleIcon;
  className?: string;
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  );
}

export function AmazonLogo() {
  return <BrandMark icon={siAmazon} />;
}

export function MetaLogo() {
  return <BrandMark icon={siMeta} />;
}

export function NetflixLogo() {
  return <BrandMark icon={siNetflix} />;
}
