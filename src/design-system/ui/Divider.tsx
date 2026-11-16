import React from 'react';

export function Divider({ className = '' }: { className?: string }) {
  return (
    <hr
      className={['border-0 border-t border-[var(--sm-border-subtle)]', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
