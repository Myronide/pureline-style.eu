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

/** QML document mark from vscode-icons (MIT), recoloured to currentColor. It is a file mark, not the Qt logo. */
function QmlMark({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden>
      <path d="M27.3 5H5.886L2 8.958V26h24.114L30 22.042V5ZM16.9 23.07l-1.828.852-1.572-2.591a4 4 0 0 1-1.082.106c-1.845 0-3.123-.5-3.85-1.49a8.03 8.03 0 0 1-1.082-4.7 8.35 8.35 0 0 1 1.1-4.773 4.38 4.38 0 0 1 3.833-1.561c1.828 0 3.087.515 3.833 1.544a8.35 8.35 0 0 1 1.1 4.773 10.8 10.8 0 0 1-.452 3.44 3.9 3.9 0 0 1-1.473 2Zm5.848-1.67a2.74 2.74 0 0 1-2.168-.692A4.2 4.2 0 0 1 20 18.1V14h-1v-2h1V9h2v3h2v2h-2v3.9a3.9 3.9 0 0 0 .168 1.437c.112.231.393.355.86.355l1.533-.053.093 1.544a12.5 12.5 0 0 1-1.906.217M12.416 10.614a2.4 2.4 0 0 0-2.289 1.1 7.66 7.66 0 0 0-.6 3.513 7.1 7.1 0 0 0 .6 3.442 2.44 2.44 0 0 0 2.306 1.031 2.42 2.42 0 0 0 2.289-1.011 7.34 7.34 0 0 0 .586-3.442 7.7 7.7 0 0 0-.6-3.531 2.4 2.4 0 0 0-2.292-1.102" />
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
  "languages/react": "simple-icons:react",
  "languages/rust": "simple-icons:rust",
  "languages/typescript": "simple-icons:typescript",
};

const marks: Record<string, (props: { className: string }) => React.JSX.Element> = {
  "languages/emvus": EmvusMark,
  "languages/emerald": EmeraldMark,
  "languages/qml": QmlMark,
};

/** Renders the logo of a language profile, or nothing when none is available. */
export function LanguageLogo({ slug, className = "size-5" }: { slug: string; className?: string }) {
  const Mark = marks[slug];
  if (Mark) {
    return <Mark className={className} />;
  }
  const name = iconify[slug];
  return name ? <Icon name={name} className={className} /> : null;
}
