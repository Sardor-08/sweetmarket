import React from 'react';
import { Clock, Heart, MapPin, ShieldCheck, Store } from 'lucide-react';
import { Divider } from '../../design-system/ui';
import { useTranslation } from '../../hooks/useTranslation';
import { CategorySummary, DietaryOption, ProductCategory } from '../../types';

export interface DesktopSidebarProps {
  categories: CategorySummary[];
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (category: ProductCategory | 'all') => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  selectedDietary: DietaryOption | 'all';
  onSelectDietary: (dietary: DietaryOption | 'all') => void;
  fastOnly: boolean;
  onToggleFastOnly: () => void;
  favoritesOnly: boolean;
  favoritesCount: number;
  onToggleFavoritesOnly: () => void;
  onOpenBakeries: () => void;
}

const ALL_CATEGORIES_ORDER: ProductCategory[] = [
  ProductCategory.CAKES,
  ProductCategory.BENTO_CAKES,
  ProductCategory.PASTRIES,
  ProductCategory.EASTERN_SWEETS,
  ProductCategory.CHOCOLATES,
  ProductCategory.MACARONS_ECLAIRS,
  ProductCategory.DIETARY,
  ProductCategory.GIFT_BOXES,
  ProductCategory.WEDDING_CAKES,
  ProductCategory.BREAKFAST_BAKES,
  ProductCategory.HALVA_NAVVOT,
];

const DIETARY_FILTERS: DietaryOption[] = [
  DietaryOption.HALAL,
  DietaryOption.SUGAR_FREE,
  DietaryOption.GLUTEN_FREE,
];

export function DesktopSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedDistrict,
  onSelectDistrict,
  selectedDietary,
  onSelectDietary,
  fastOnly,
  onToggleFastOnly,
  favoritesOnly,
  favoritesCount,
  onToggleFavoritesOnly,
  onOpenBakeries,
}: DesktopSidebarProps) {
  const { t } = useTranslation();

  const countByCategory = new Map<ProductCategory, number>();
  let totalCount = 0;
  for (const item of categories) {
    countByCategory.set(item.id, item.count);
    totalCount += item.count;
  }

  return (
    <aside
      aria-label={t.sidebar.categoriesTitle}
      className="hidden lg:block w-64 shrink-0"
    >
      <div className="sticky top-22 rounded-[12px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] sm-lens p-5 space-y-5">
        {/* 11 Categories Navigation */}
        <div className="space-y-2">
          <h2 className="font-sans text-xs font-semibold text-[var(--sm-text-muted)]">
            {t.sidebar.categoriesTitle}
          </h2>
          <nav aria-label={t.sidebar.categoriesTitle} className="space-y-0.5">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              aria-current={selectedCategory === 'all' ? 'true' : undefined}
              className={[
                'w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-[6px] text-left text-[13px] transition-colors cursor-pointer',
                selectedCategory === 'all'
                  ? 'bg-[var(--sm-accent-primary-soft)] font-semibold text-[var(--sm-accent-primary)]'
                  : 'text-[var(--sm-text-primary)] hover:bg-[var(--sm-bg-subtle)]',
              ].join(' ')}
            >
              <span className="truncate">{t.sidebar.allCategories}</span>
              <span className="font-mono text-[11px] tabular-nums text-[var(--sm-text-muted)]">
                {totalCount}
              </span>
            </button>

            {ALL_CATEGORIES_ORDER.map((categoryId) => {
              const active = selectedCategory === categoryId;
              const count = countByCategory.get(categoryId) ?? 0;
              return (
                <button
                  key={categoryId}
                  type="button"
                  onClick={() => onSelectCategory(categoryId)}
                  aria-current={active ? 'true' : undefined}
                  className={[
                    'w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[6px] text-left text-[13px] transition-colors cursor-pointer',
                    active
                      ? 'bg-[var(--sm-accent-primary-soft)] font-semibold text-[var(--sm-accent-primary)]'
                      : 'text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)] hover:bg-[var(--sm-bg-subtle)]',
                  ].join(' ')}
                >
                  <span className="truncate">{t.categoriesMap[categoryId]}</span>
                  <span className="font-mono text-[11px] tabular-nums text-[var(--sm-text-muted)]">
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <Divider />

        {/* Samarkand Districts */}
        <div className="space-y-2">
          <h2 className="font-sans text-xs font-semibold text-[var(--sm-text-muted)] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.sidebar.districtsTitle}</span>
          </h2>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => onSelectDistrict('all')}
              className={[
                'w-full text-left px-2.5 py-1.5 rounded-[6px] text-[13px] transition-colors cursor-pointer',
                selectedDistrict === 'all'
                  ? 'bg-[var(--sm-bg-subtle)] font-semibold text-[var(--sm-text-primary)]'
                  : 'text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)] hover:bg-[var(--sm-bg-subtle)]',
              ].join(' ')}
            >
              {t.sidebar.allDistricts}
            </button>
            {(['registon', 'universitet', 'siyob', 'sartepa', 'sogdiana'] as const).map(
              (districtKey, index) => {
                const label = t.catalog.districts[index] ?? districtKey;
                const active = selectedDistrict === districtKey;
                return (
                  <button
                    key={districtKey}
                    type="button"
                    onClick={() => onSelectDistrict(districtKey)}
                    className={[
                      'w-full text-left px-2.5 py-1.5 rounded-[6px] text-[13px] transition-colors cursor-pointer truncate',
                      active
                        ? 'bg-[var(--sm-bg-subtle)] font-semibold text-[var(--sm-text-primary)]'
                        : 'text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)] hover:bg-[var(--sm-bg-subtle)]',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                );
              },
            )}
          </div>
        </div>

        <Divider />

        {/* Dietary & Fast Prep Filters */}
        <div className="space-y-2">
          <h2 className="font-sans text-xs font-semibold text-[var(--sm-text-muted)] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.sidebar.dietaryTitle}</span>
          </h2>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => onSelectDietary('all')}
              className={[
                'w-full text-left px-2.5 py-1.5 rounded-[6px] text-[13px] transition-colors cursor-pointer',
                selectedDietary === 'all'
                  ? 'bg-[var(--sm-bg-subtle)] font-semibold text-[var(--sm-text-primary)]'
                  : 'text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)] hover:bg-[var(--sm-bg-subtle)]',
              ].join(' ')}
            >
              {t.sidebar.allDietary}
            </button>
            {DIETARY_FILTERS.map((diet) => {
              const active = selectedDietary === diet;
              return (
                <button
                  key={diet}
                  type="button"
                  onClick={() => onSelectDietary(active ? 'all' : diet)}
                  className={[
                    'w-full text-left px-2.5 py-1.5 rounded-[6px] text-[13px] transition-colors cursor-pointer',
                    active
                      ? 'bg-[var(--sm-accent-primary-soft)] font-semibold text-[var(--sm-accent-primary)]'
                      : 'text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)] hover:bg-[var(--sm-bg-subtle)]',
                  ].join(' ')}
                >
                  {t.dietaryMap[diet]}
                </button>
              );
            })}
          </div>
        </div>

        <Divider />

        {/* Fast Prep, Favorites & Bakeries Shortcut */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={onToggleFastOnly}
            aria-pressed={fastOnly}
            className={[
              'w-full flex items-center gap-2 px-2.5 py-2 rounded-[6px] text-[13px] transition-colors cursor-pointer text-left',
              fastOnly
                ? 'bg-[var(--sm-accent-primary-soft)] font-semibold text-[var(--sm-accent-primary)]'
                : 'text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)] hover:bg-[var(--sm-bg-subtle)]',
            ].join(' ')}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{t.sidebar.fastPrepOnly}</span>
          </button>

          <button
            type="button"
            onClick={onToggleFavoritesOnly}
            aria-pressed={favoritesOnly}
            className={[
              'w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-[6px] text-[13px] transition-colors cursor-pointer',
              favoritesOnly
                ? 'bg-[var(--sm-accent-primary-soft)] font-semibold text-[var(--sm-accent-primary)]'
                : 'text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)] hover:bg-[var(--sm-bg-subtle)]',
            ].join(' ')}
          >
            <span className="inline-flex items-center gap-2 truncate">
              <Heart
                className="w-3.5 h-3.5 shrink-0"
                fill={favoritesOnly ? 'currentColor' : 'none'}
                aria-hidden="true"
              />
              <span>{t.sidebar.favoritesOnly}</span>
            </span>
            <span className="font-mono text-[11px] tabular-nums">{favoritesCount}</span>
          </button>

          <button
            type="button"
            onClick={onOpenBakeries}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-[6px] text-[13px] text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)] hover:bg-[var(--sm-bg-subtle)] transition-colors cursor-pointer text-left"
          >
            <Store className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{t.sidebar.bakeriesShortcut}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
