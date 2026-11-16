import React from 'react';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  interactive?: boolean;
  tone?: 'surface' | 'subtle';
}

const PADDING_MAP: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  padding = 'md',
  interactive = false,
  tone = 'surface',
  className = '',
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        'relative rounded-[20px] border border-[var(--sm-border-subtle)] sm-lens',
        tone === 'surface' ? 'bg-[var(--sm-bg-surface)]' : 'bg-[var(--sm-bg-subtle)]',
        interactive
          ? 'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[var(--sm-border-strong)]'
          : '',
        PADDING_MAP[padding],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}
