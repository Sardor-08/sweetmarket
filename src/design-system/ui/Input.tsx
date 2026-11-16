import React, { useId } from 'react';
import { AlertCircle, Search } from 'lucide-react';

interface BaseFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
}

const INPUT_SURFACE_CLASSES = [
  'w-full min-h-[44px] rounded-[8px] px-3.5 py-2.5 text-sm sm-lens',
  'bg-[var(--sm-bg-surface)] text-[var(--sm-text-primary)]',
  'placeholder:text-[var(--sm-text-muted)]',
  'border transition-colors duration-150',
  'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[var(--sm-focus-ring)]',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ');

function FieldFeedback({
  hintId,
  errorId,
  hint,
  error,
}: {
  hintId: string;
  errorId: string;
  hint?: string;
  error?: string;
}) {
  if (error) {
    return (
      <p
        id={errorId}
        role="alert"
        className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--sm-status-danger)]"
      >
        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{error}</span>
      </p>
    );
  }

  if (hint) {
    return (
      <p id={hintId} className="mt-1.5 text-xs text-[var(--sm-text-muted)]">
        {hint}
      </p>
    );
  }

  return null;
}

export interface TextInputProps
  extends BaseFieldProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tabular?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  {
    label,
    hint,
    error,
    required,
    containerClassName = '',
    className = '',
    leftSlot,
    rightSlot,
    tabular = false,
    id,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1.5 text-xs font-semibold text-[var(--sm-text-secondary)]"
        >
          {label}
          {required && (
            <span className="ml-1 text-[var(--sm-accent-primary)]" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative flex items-center">
        {leftSlot && (
          <span className="absolute left-3.5 inline-flex items-center text-[var(--sm-text-muted)] pointer-events-none">
            {leftSlot}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={[
            INPUT_SURFACE_CLASSES,
            leftSlot ? 'pl-10' : '',
            rightSlot ? 'pr-10' : '',
            tabular ? 'tabular-nums font-mono' : '',
            error
              ? 'border-[var(--sm-status-danger)]'
              : 'border-[var(--sm-border-strong)] hover:border-[var(--sm-text-muted)]',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {rightSlot && (
          <span className="absolute right-3.5 inline-flex items-center text-[var(--sm-text-muted)]">
            {rightSlot}
          </span>
        )}
      </div>
      <FieldFeedback hintId={hintId} errorId={errorId} hint={hint} error={error} />
    </div>
  );
});

export interface SearchInputProps
  extends Omit<TextInputProps, 'leftSlot' | 'type'> {}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(props, ref) {
    return (
      <TextInput
        ref={ref}
        type="search"
        leftSlot={<Search className="w-4 h-4" aria-hidden="true" />}
        {...props}
      />
    );
  },
);

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectInputProps
  extends BaseFieldProps,
    React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  function SelectInput(
    { label, hint, error, required, containerClassName = '', className = '', options, id, ...rest },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const hintId = `${selectId}-hint`;
    const errorId = `${selectId}-error`;
    const describedBy = error ? errorId : hint ? hintId : undefined;

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={selectId}
            className="block mb-1.5 text-xs font-semibold text-[var(--sm-text-secondary)]"
          >
            {label}
            {required && (
              <span className="ml-1 text-[var(--sm-accent-primary)]" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={[
            INPUT_SURFACE_CLASSES,
            'cursor-pointer',
            error
              ? 'border-[var(--sm-status-danger)]'
              : 'border-[var(--sm-border-strong)] hover:border-[var(--sm-text-muted)]',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FieldFeedback hintId={hintId} errorId={errorId} hint={hint} error={error} />
      </div>
    );
  },
);

export interface TextAreaProps
  extends BaseFieldProps,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, required, containerClassName = '', className = '', id, rows = 3, ...rest },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const hintId = `${textareaId}-hint`;
  const errorId = `${textareaId}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block mb-1.5 text-xs font-semibold text-[var(--sm-text-secondary)]"
        >
          {label}
          {required && (
            <span className="ml-1 text-[var(--sm-accent-primary)]" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        className={[
          INPUT_SURFACE_CLASSES,
          'min-h-[96px] resize-y',
          error
            ? 'border-[var(--sm-status-danger)]'
            : 'border-[var(--sm-border-strong)] hover:border-[var(--sm-text-muted)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      <FieldFeedback hintId={hintId} errorId={errorId} hint={hint} error={error} />
    </div>
  );
});
