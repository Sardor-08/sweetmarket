import React from 'react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  as = 'h2',
  className = '',
}: SectionHeaderProps) {
  const HeadingTag = as;

  return (
    <div
      className={[
        'flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="max-w-2xl">
        <HeadingTag className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--sm-text-primary)]">
          {title}
        </HeadingTag>
        {subtitle && (
          <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-[var(--sm-text-secondary)]">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
