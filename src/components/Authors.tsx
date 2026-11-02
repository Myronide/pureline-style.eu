const authors = [
  { name: "SyntaxJason", url: "https://github.com/SyntaxJason" },
  { name: "ezTxmMC", url: "https://github.com/ezTxmMC" },
];

export function Authors() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="text-muted">by</span>
      {authors.map((a) => (
        <a
          key={a.name}
          href={a.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface py-1 pl-1 pr-2.5 font-medium transition-colors hover:border-accent hover:bg-raised"
        >
          <img
            src={`${a.url}.png?size=48`}
            alt=""
            width={48}
            height={48}
            loading="lazy"
            className="size-5 rounded-full bg-raised object-cover"
          />
          {a.name}
        </a>
      ))}
    </div>
  );
}
