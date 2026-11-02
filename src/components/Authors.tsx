const authors = [
  { name: "ezTxmMC", url: "https://github.com/ezTxmMC" },
  { name: "SyntaxJason", url: "https://github.com/SyntaxJason" },
];

type Size = "sm" | "lg";

const avatarSize: Record<Size, string> = { sm: "size-6", lg: "size-10" };

export function Authors({ size = "lg" }: { size?: Size }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="text-muted">by</span>
      {authors.map((a) => (
        <a
          key={a.name}
          href={a.url}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2.5 font-medium transition-colors hover:text-accent"
        >
          <img
            src={`${a.url}.png?size=96`}
            alt=""
            width={96}
            height={96}
            loading="lazy"
            className={`${avatarSize[size]} rounded-full border border-line bg-surface object-cover transition-colors group-hover:border-accent`}
          />
          {a.name}
        </a>
      ))}
    </div>
  );
}
