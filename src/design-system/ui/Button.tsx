import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--sm-accent-primary)] text-[var(--sm-text-inverse)] hover:bg-[var(--sm-accent-primary-hover)] border border-transparent',
  secondary:
    'bg-[var(--sm-bg-subtle)] sm-lens text-[var(--sm-text-primary)] hover:bg-[var(--sm-border-subtle)] border border-[var(--sm-border-subtle)]',
  outline:
    'bg-[var(--sm-bg-surface)] sm-lens text-[var(--sm-text-primary)] hover:bg-[var(--sm-bg-subtle)] border border-[var(--sm-border-strong)]',
  ghost:
    'bg-transparent text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)] hover:bg-[var(--sm-bg-subtle)] border border-transparent',
  danger:
    'bg-[var(--sm-status-danger)] text-white hover:opacity-90 border border-transparent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-[38px] px-3.5 py-1.5 text-xs rounded-[6px]',
  md: 'min-h-[42px] px-5 py-2.5 text-sm rounded-[8px]',
  lg: 'min-h-[46px] px-6 py-3 text-sm rounded-[8px]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    disabled,
    className = '',
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const isDisabled = Boolean(disabled || isLoading);

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap shrink-0',
        'transition-[background-color,border-color,color,transform,opacity] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'active:scale-[0.985] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sm-focus-ring)]',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
      ) : (
        leftIcon && <span className="shrink-0 inline-flex items-center">{leftIcon}</span>
      )}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && (
        <span className="shrink-0 inline-flex items-center">{rightIcon}</span>
      )}
    </button>
  );
});
