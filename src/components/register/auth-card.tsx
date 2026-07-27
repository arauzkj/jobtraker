export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-card/85 p-6 shadow-xl backdrop-blur-md sm:p-8">
      <div className="mb-6 flex flex-col gap-1">
        <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
          {eyebrow}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {children}

      {footer && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {footer}
        </p>
      )}
    </section>
  );
}
