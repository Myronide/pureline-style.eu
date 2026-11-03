import { Icon } from "./Icon";

/** Monochrome language marks. They use currentColor, so they follow the text colour of their context. */

const emvusPath =
  "M0 0H316L426 194L540 0H648L466 316H399L264 72H72V118H264L289 164H72V238H338L381 316H0Z";

function EmvusMark({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 648 316" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d={emvusPath} />
    </svg>
  );
}

/** Facets are shaded by opacity instead of colour, so the gem stays one hue. */
function EmeraldMark({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 100 80" fill="currentColor" className={className} aria-hidden>
      <polygon points="0,25 20,25 12,0" fillOpacity={1} />
      <polygon points="20,25 40,25 32,0 12,0" fillOpacity={0.7} />
      <polygon points="40,25 60,25 68,0 32,0" fillOpacity={0.5} />
      <polygon points="60,25 80,25 88,0 68,0" fillOpacity={0.7} />
      <polygon points="80,25 100,25 88,0" fillOpacity={1} />
      <polygon points="0,25 30,25 50,80" fillOpacity={0.3} />
      <polygon points="30,25 50,25 50,80" fillOpacity={0.5} />
      <polygon points="50,25 70,25 50,80" fillOpacity={0.7} />
      <polygon points="70,25 100,25 50,80" fillOpacity={0.3} />
    </svg>
  );
}

/** Simple Icons (CC0, single colour) via Iconify. Novus has no logo and is left without one. */
const iconify: Record<string, string> = {
  "languages/astro": "simple-icons:astro",
  "languages/crystal": "simple-icons:crystal",
  "languages/css": "simple-icons:css3",
  "languages/go": "simple-icons:go",
  "languages/html": "simple-icons:html5",
  "languages/java": "simple-icons:openjdk",
  "languages/javascript": "simple-icons:javascript",
  "languages/python": "simple-icons:python",
  "languages/qml": "simple-icons:qt",
  "languages/react": "simple-icons:react",
  "languages/rust": "simple-icons:rust",
  "languages/typescript": "simple-icons:typescript",
};

const marks: Record<string, (props: { className: string }) => React.JSX.Element> = {
  "languages/emvus": EmvusMark,
  "languages/emerald": EmeraldMark,
};

/** Renders the logo of a language profile, or nothing when none is available. */
export function LanguageLogo({ slug, className = "size-5" }: { slug: string; className?: string }) {
  const Mark = marks[slug];
  if (Mark) return <Mark className={className} />;
  const name = iconify[slug];
  return name ? <Icon name={name} className={className} /> : null;
}
