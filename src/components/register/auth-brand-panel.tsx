export function AuthBrandPanel({
  icon: Icon,
  brandName,
  title,
  description,
  features,
}: AuthBrandPanelProps) {
  return (
    <section className="hidden flex-col gap-6 lg:flex">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-accent-foreground">
          <Icon className="size-5" />
        </span>
        <span className="font-mono text-sm font-medium tracking-widest uppercase">
          {brandName}
        </span>
      </div>
      <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight">
        {title}
      </h1>
      <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
        {description}
      </p>
      <ul className="flex flex-col gap-3 pt-2">
        {features.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 text-sm text-muted-foreground"
          >
            <span className="size-1.5 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
