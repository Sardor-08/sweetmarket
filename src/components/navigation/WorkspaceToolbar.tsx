import React from 'react';
import { Moon, Sun, X } from 'lucide-react';
import { SearchInput } from '../../design-system/ui';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { Locale } from '../../types';

export interface WorkspaceToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const LOCALES: { code: Locale; short: string; full: string }[] = [
  { code: 'uz', short: "O'Z", full: "O'zbekcha" },
  { code: 'ru', short: 'РУ', full: 'Русский' },
];

export function WorkspaceToolbar({
  searchQuery,
  onSearchChange,
}: WorkspaceToolbarProps) {
  const { locale, setLocale, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="border-b border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] sm-lens">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        {/* Global Storefront Search Bar */}
        <div className="w-full lg:max-w-lg">
          <SearchInput
            aria-label={t.toolbar.searchPlaceholder}
            placeholder={t.toolbar.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            rightSlot={
              searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label={t.toolbar.searchClear}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[var(--sm-text-muted)] hover:text-[var(--sm-text-primary)] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              ) : undefined
            }
          />
        </div>

        {/* Language + Theme Controls */}
        <div className="flex items-center justify-end gap-2.5 shrink-0">
          <div
            role="group"
            aria-label={t.toolbar.languageLabel}
            className="inline-flex items-center gap-1 rounded-[8px] bg-[var(--sm-bg-subtle)] p-1 border border-[var(--sm-border-subtle)]"
          >
            {LOCALES.map((item) => {
              const active = locale === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLocale(item.code)}
                  aria-pressed={active}
                  aria-label={item.full}
                  className={[
                    'px-2.5 py-1.5 text-xs font-semibold rounded-[6px] whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150',
                    'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--sm-focus-ring)]',
                    active
                      ? 'bg-[var(--sm-bg-surface)] text-[var(--sm-text-primary)] shadow-xs'
                      : 'text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)]',
                  ].join(' ')}
                >
                  <span className="sm:hidden">{item.short}</span>
                  <span className="hidden sm:inline">{item.full}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t.toolbar.themeLabel}
            className="inline-flex min-h-[38px] items-center gap-2 rounded-[8px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--sm-text-primary)] hover:border-[var(--sm-border-strong)] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sm-focus-ring)]"
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[var(--sm-accent-gold)]" aria-hidden="true" />
                <span className="hidden sm:inline">{t.toolbar.themeLight}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[var(--sm-accent-primary)]" aria-hidden="true" />
                <span className="hidden sm:inline">{t.toolbar.themeDark}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
