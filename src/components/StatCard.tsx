import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: "primary" | "secondary" | "neutral";
  icon?: ReactNode;
}

const accentClasses: Record<
  NonNullable<StatCardProps["accent"]>,
  string
> = {
  primary: "border-primary/20 bg-primary/5 text-primary",
  secondary: "border-secondary/40 bg-secondary/40 text-text/80",
  neutral: "border-neutral/30 bg-white text-text/80",
};

export const StatCard = ({
  title,
  value,
  subtitle,
  accent = "neutral",
  icon,
}: StatCardProps) => {
  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-[1px] hover:shadow-lg ${accentClasses[accent]}`}
    >
      <header className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium uppercase tracking-[0.2em]">
          {title}
        </h3>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-lg">
            {icon}
          </span>
        )}
      </header>
      <p className="mt-4 text-3xl font-semibold">{value}</p>
      {subtitle && (
        <p className="mt-2 text-sm opacity-70">
          {subtitle}
        </p>
      )}
    </article>
  );
};
