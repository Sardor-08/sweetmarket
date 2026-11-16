import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CakeSlice, Clock, Gift, Heart, RotateCcw, Search, Sparkles, X } from 'lucide-react';
import { PRODUCT_MEDIA_MAP } from '../assets/productMedia';
import { ProductCard } from '../components/catalog/ProductCard';
import { ReelsStrip } from '../components/catalog/ReelsStrip';
import { StoryViewerModal } from '../components/catalog/StoryViewerModal';
import { Button, Card, SelectInput } from '../design-system/ui';
import { useTranslation } from '../hooks/useTranslation';
import { fetchShowcaseCatalog } from '../services/api/client';
import {
  BakeryReel,
  BakeryStory,
  BakerySummary,
  CatalogSortOption,
  DietaryOption,
  OccasionCollectionId,
  ProductCategory,
  ShowcaseProduct,
} from '../types';

export interface CatalogBlueprintPageProps {
  stories: BakeryStory[];
  reels: BakeryReel[];
  allProducts: ShowcaseProduct[];
  bakeries: BakerySummary[];
  initialCategory?: ProductCategory | 'all';
  initialDistrict?: string;
  initialBakeryId?: string;
  favoriteIds: string[];
  onToggleFavorite: (productId: string) => void;
  onSelectProduct: (product: ShowcaseProduct) => void;
  onQuickAdd: (product: ShowcaseProduct) => void;
  onStoryUpdated?: (story: BakeryStory) => void;
}

const DISTRICT_KEYS = ['registon', 'universitet', 'siyob', 'sartepa', 'sogdiana'] as const;
const SORT_OPTIONS: CatalogSortOption[] = [
  'popular',
  'price_asc',
  'price_desc',
  'rating',
  'fastest',
];

const ALL_CATEGORIES: ProductCategory[] = [
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

const OCCASION_ICONS: Record<OccasionCollectionId, React.ReactNode> = {
  birthday: <CakeSlice className="w-4 h-4" />,
  romantic: <Heart className="w-4 h-4" />,
  wedding: <Sparkles className="w-4 h-4" />,
  gift_sets: <Gift className="w-4 h-4" />,
};

export function CatalogBlueprintPage({
  stories,
  reels,
  allProducts,
  bakeries,
  initialCategory = 'all',
  initialDistrict = 'all',
  initialBakeryId = 'all',
  favoriteIds,
  onToggleFavorite,
  onSelectProduct,
  onQuickAdd,
  onStoryUpdated,
}: CatalogBlueprintPageProps) {
  const { locale, t } = useTranslation();

  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState(initialDistrict);
  const [category, setCategory] = useState<string>(initialCategory);
  const [bakeryId, setBakeryId] = useState<string>(initialBakeryId);
  const [dietary, setDietary] = useState<string>('all');
  const [occasion, setOccasion] = useState<OccasionCollectionId | 'all'>('all');
  const [fastOnly, setFastOnly] = useState(false);
  const [sort, setSort] = useState<CatalogSortOption>('popular');

  const [products, setProducts] = useState<ShowcaseProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [viewedStoryIds, setViewedStoryIds] = useState<string[]>([]);
  const [pullOffset, setPullOffset] = useState(0);

  const touchStartYRef = useRef<number | null>(null);
  const wheelAccumRef = useRef<number>(0);
  const wheelTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setDistrict(initialDistrict);
  }, [initialDistrict]);

  useEffect(() => {
    setBakeryId(initialBakeryId);
  }, [initialBakeryId]);

  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchShowcaseCatalog({
        category,
        district,
        bakeryId,
        dietary,
        occasion,
        fastOnly,
        sort,
        q: query,
      });
      setProducts(response.items);
    } finally {
      setIsLoading(false);
    }
  }, [category, district, bakeryId, dietary, occasion, fastOnly, sort, query]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCatalog();
    }, 100);
    return () => window.clearTimeout(timer);
  }, [loadCatalog]);

  const handleOpenStory = useCallback(
    (index: number) => {
      setActiveStoryIndex(index);
      const story = stories[index];
      if (story && !viewedStoryIds.includes(story.id)) {
        setViewedStoryIds((prev) => [...prev, story.id]);
      }
    },
    [stories, viewedStoryIds],
  );

  // Pull-down gesture at top of page opens Stories (hidden during normal browsing)
  useEffect(() => {
    if (stories.length === 0) return;

    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 4 && e.touches.length === 1) {
        touchStartYRef.current = e.touches[0].clientY;
      } else {
        touchStartYRef.current = null;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null || window.scrollY > 4) return;
      const dy = e.touches[0].clientY - touchStartYRef.current;
      if (dy > 0) {
        setPullOffset(Math.min(110, dy * 0.55));
      } else {
        setPullOffset(0);
      }
    };

    const onTouchEnd = () => {
      if (touchStartYRef.current !== null && pullOffset >= 72) {
        handleOpenStory(0);
      }
      touchStartYRef.current = null;
      setPullOffset(0);
    };

    const onWheel = (e: WheelEvent) => {
      if (activeStoryIndex !== null) return;
      if (window.scrollY <= 2 && e.deltaY < 0) {
        wheelAccumRef.current += Math.abs(e.deltaY);
        setPullOffset(Math.min(110, wheelAccumRef.current * 0.45));

        if (wheelTimerRef.current) window.clearTimeout(wheelTimerRef.current);
        wheelTimerRef.current = window.setTimeout(() => {
          wheelAccumRef.current = 0;
          setPullOffset(0);
        }, 500);

        if (wheelAccumRef.current >= 165) {
          wheelAccumRef.current = 0;
          setPullOffset(0);
          handleOpenStory(0);
        }
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('wheel', onWheel);
      if (wheelTimerRef.current) window.clearTimeout(wheelTimerRef.current);
    };
  }, [stories.length, pullOffset, activeStoryIndex, handleOpenStory]);

  const handleChangeStoryIndex = (index: number) => {
    setActiveStoryIndex(index);
    const story = stories[index];
    if (story && !viewedStoryIds.includes(story.id)) {
      setViewedStoryIds((prev) => [...prev, story.id]);
    }
  };

  const handleReset = () => {
    setQuery('');
    setDistrict('all');
    setCategory('all');
    setBakeryId('all');
    setDietary('all');
    setOccasion('all');
    setFastOnly(false);
    setSort('popular');
  };

  const hasFilters =
    query.trim().length > 0 ||
    district !== 'all' ||
    category !== 'all' ||
    bakeryId !== 'all' ||
    dietary !== 'all' ||
    occasion !== 'all' ||
    fastOnly ||
    sort !== 'popular';

  const row1Products = products.slice(0, 4);
  const row2Products = products.slice(4, 8);
  const remainingProducts = products.slice(8);

  const reelsGroup1 = reels.slice(0, 2);
  const reelsGroup2 = reels.slice(2, 4);

  return (
    <div className="space-y-6 py-6 sm:py-10">
      {/* Hidden Pull-Down Story Peek (Visible ONLY while overscrolling down at top, zero "24 soatlik Stories" label) */}
      {pullOffset > 14 && stories.length > 0 && (
        <div
          className="overflow-hidden transition-all duration-150"
          style={{ height: `${Math.min(88, pullOffset)}px`, opacity: Math.min(1, pullOffset / 65) }}
          aria-hidden="true"
        >
          <div className="flex items-center justify-center gap-3 py-2">
            {stories.map((story) => (
              <div
                key={story.id}
                className="h-14 w-14 rounded-full p-[2px] bg-gradient-to-tr from-[var(--sm-accent-primary)] via-[#c98b5b] to-[var(--sm-accent-gold)] shrink-0"
              >
                <img
                  src={PRODUCT_MEDIA_MAP[story.mediaKey]}
                  alt=""
                  className="h-full w-full rounded-full object-cover border-2 border-[var(--sm-bg-canvas)]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1. iOS Mirror-Glass Mega Search & Filters Panel (FIRST in Catalog) */}
      <section
        aria-label={t.catalog.megaSearchTitle}
        className="rounded-[24px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] sm-lens p-5 sm:p-6 space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--sm-text-primary)]">
            {t.catalog.heading}
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tabular-nums text-[var(--sm-text-muted)]">
              {products.length} {t.catalog.resultsCountLabel}
            </span>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={handleReset}
              >
                {t.catalog.resetFilters}
              </Button>
            )}
          </div>
        </div>

        {/* Spotlight Mega Search Bar */}
        <div className="relative flex items-center">
          <Search
            className="pointer-events-none absolute left-4 w-5 h-5 text-[var(--sm-accent-primary)]"
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label={t.catalog.megaSearchPlaceholder}
            placeholder={t.catalog.megaSearchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-13 sm:h-14 rounded-[16px] border border-[var(--sm-border-strong)] bg-[var(--sm-bg-elevated)] pl-12 pr-12 text-sm sm:text-base text-[var(--sm-text-primary)] placeholder:text-[var(--sm-text-muted)] focus:outline-none focus:border-[var(--sm-accent-primary)] focus:ring-2 focus:ring-[var(--sm-accent-primary)]/25 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t.toolbar.searchClear}
              className="absolute right-3.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--sm-bg-subtle)] text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)] cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Category Quick Tabs */}
        <div
          role="tablist"
          aria-label={t.catalog.filterCategoryLabel}
          className="flex items-center gap-1.5 overflow-x-auto pb-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={category === 'all'}
            onClick={() => setCategory('all')}
            className={[
              'px-3.5 py-2 text-xs font-medium rounded-[11px] border whitespace-nowrap shrink-0 cursor-pointer transition-colors',
              category === 'all'
                ? 'bg-[var(--sm-accent-primary)] text-[var(--sm-text-inverse)] border-transparent'
                : 'bg-[var(--sm-bg-subtle)] text-[var(--sm-text-secondary)] border-[var(--sm-border-subtle)] hover:text-[var(--sm-text-primary)]',
            ].join(' ')}
          >
            {t.catalog.allCategories}
          </button>

          {ALL_CATEGORIES.map((catId) => {
            const active = category === catId;
            return (
              <button
                key={catId}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(catId)}
                className={[
                  'px-3.5 py-2 text-xs font-medium rounded-[11px] border whitespace-nowrap shrink-0 cursor-pointer transition-colors',
                  active
                    ? 'bg-[var(--sm-accent-primary)] text-[var(--sm-text-inverse)] border-transparent'
                    : 'bg-[var(--sm-bg-subtle)] text-[var(--sm-text-secondary)] border-[var(--sm-border-subtle)] hover:text-[var(--sm-text-primary)]',
                ].join(' ')}
              >
                {t.categoriesMap[catId]}
              </button>
            );
          })}
        </div>

        {/* Special Occasion Collections ("Maxsus bo'linma": Tug'ilgan kun, Sevishganlar, To'y, Sovg'alar) */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-semibold text-[var(--sm-text-secondary)]">
              {t.catalog.occasionsTitle}
            </h2>
            {occasion !== 'all' && (
              <button
                type="button"
                onClick={() => setOccasion('all')}
                className="text-xs font-medium text-[var(--sm-accent-primary)] hover:underline cursor-pointer"
              >
                {t.catalog.allOccasions}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {t.catalog.occasions.map((item) => {
              const active = occasion === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOccasion(active ? 'all' : item.id)}
                  aria-pressed={active}
                  className={[
                    'flex items-start gap-3 rounded-[14px] border p-3 text-left transition-all cursor-pointer',
                    active
                      ? 'border-[var(--sm-accent-primary)] bg-[var(--sm-accent-primary-soft)] text-[var(--sm-text-primary)]'
                      : 'border-[var(--sm-border-subtle)] bg-[var(--sm-bg-subtle)] text-[var(--sm-text-secondary)] hover:border-[var(--sm-border-strong)]',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-[10px] shrink-0',
                      active
                        ? 'bg-[var(--sm-accent-primary)] text-[var(--sm-text-inverse)]'
                        : 'bg-[var(--sm-bg-elevated)] text-[var(--sm-accent-primary)]',
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    {OCCASION_ICONS[item.id]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--sm-text-primary)] truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[var(--sm-text-muted)] line-clamp-1 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Structured Mega Filter Row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SelectInput
            aria-label={t.catalog.filterDistrictLabel}
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            options={[
              { value: 'all', label: t.catalog.allDistricts },
              ...DISTRICT_KEYS.map((key, idx) => ({
                value: key,
                label: t.catalog.districts[idx] ?? key,
              })),
            ]}
          />

          <SelectInput
            aria-label={t.catalog.filterBakeryLabel}
            value={bakeryId}
            onChange={(e) => setBakeryId(e.target.value)}
            options={[
              { value: 'all', label: t.catalog.allBakeries },
              ...bakeries.map((b) => ({
                value: b.id,
                label: b.name,
              })),
            ]}
          />

          <SelectInput
            aria-label={t.catalog.filterDietaryLabel}
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            options={[
              { value: 'all', label: t.catalog.allDietary },
              ...Object.values(DietaryOption).map((d) => ({
                value: d,
                label: t.dietaryMap[d],
              })),
            ]}
          />

          <SelectInput
            aria-label={t.catalog.sortLabel}
            value={sort}
            onChange={(e) => setSort(e.target.value as CatalogSortOption)}
            options={SORT_OPTIONS.map((opt) => ({
              value: opt,
              label: t.catalog.sortOptions[opt],
            }))}
          />
        </div>

        {/* Fast-Prep Quick Toggle */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => setFastOnly((prev) => !prev)}
            aria-pressed={fastOnly}
            className={[
              'inline-flex items-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
              fastOnly
                ? 'border-[var(--sm-accent-primary)] bg-[var(--sm-accent-primary-soft)] text-[var(--sm-accent-primary)]'
                : 'border-[var(--sm-border-subtle)] bg-[var(--sm-bg-subtle)] text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)]',
            ].join(' ')}
          >
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.catalog.fastPrepLabel}</span>
          </button>
        </div>
      </section>

      {/* 2. Interleaved Adaptive Catalog Grid & Reels */}
      {isLoading ? (
        <div
          aria-busy="true"
          aria-label={t.catalog.loadingMessage}
          className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <Card key={idx} padding="none" className="overflow-hidden">
              <div className="aspect-[4/3] bg-[var(--sm-bg-subtle)] animate-pulse" />
              <div className="p-3 sm:p-5 space-y-2.5">
                <div className="h-3 w-1/2 rounded bg-[var(--sm-bg-subtle)] animate-pulse" />
                <div className="h-4 w-4/5 rounded bg-[var(--sm-bg-subtle)] animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card padding="lg" tone="subtle" className="space-y-4 text-center">
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="font-sans text-base font-semibold text-[var(--sm-text-primary)]">
              {t.catalog.emptyTitle}
            </h2>
            <p className="text-sm text-[var(--sm-text-secondary)]">
              {t.catalog.emptyBody}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            {t.catalog.resetFilters}
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Row 1 of Products (2 columns on mobile, 4 on desktop) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {row1Products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favoriteIds.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectProduct}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>

          {/* Reels Group 1 */}
          {reelsGroup1.length > 0 && (
            <ReelsStrip
              reels={reelsGroup1}
              allProducts={allProducts}
              onViewProduct={onSelectProduct}
              onQuickAdd={onQuickAdd}
            />
          )}

          {/* Row 2 of Products */}
          {row2Products.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {row2Products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favoriteIds.includes(product.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          )}

          {/* Reels Group 2 */}
          {reelsGroup2.length > 0 && row2Products.length > 0 && (
            <ReelsStrip
              reels={reelsGroup2}
              allProducts={allProducts}
              onViewProduct={onSelectProduct}
              onQuickAdd={onQuickAdd}
              hideHeader
            />
          )}

          {/* Remaining Products */}
          {remainingProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {remainingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favoriteIds.includes(product.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Story Viewer Modal (Opened via overscroll pull-down gesture) */}
      <StoryViewerModal
        stories={stories}
        activeIndex={activeStoryIndex}
        allProducts={allProducts}
        onChangeIndex={handleChangeStoryIndex}
        onClose={() => setActiveStoryIndex(null)}
        onViewProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onStoryUpdated={onStoryUpdated}
      />
    </div>
  );
}
