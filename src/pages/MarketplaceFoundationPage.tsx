import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { AppRouteId } from '../app/routes';
import { ProductCard } from '../components/catalog/ProductCard';
import { HeroCarouselBanner } from '../components/home/HeroCarouselBanner';
import { DesktopSidebar } from '../components/navigation/DesktopSidebar';
import { Button, Card, Divider, SectionHeader } from '../design-system/ui';
import { useTranslation } from '../hooks/useTranslation';
import { fetchShowcaseCatalog } from '../services/api/client';
import {
  CategorySummary,
  DietaryOption,
  ProductCategory,
  ShowcaseProduct,
} from '../types';

export interface MarketplaceFoundationPageProps {
  selectedCategory: ProductCategory | 'all';
  selectedDistrict: string;
  favoriteIds: string[];
  onSelectCategory: (category: ProductCategory | 'all') => void;
  onSelectDistrict: (district: string) => void;
  onToggleFavorite: (productId: string) => void;
  onSelectProduct: (product: ShowcaseProduct) => void;
  onQuickAdd: (product: ShowcaseProduct) => void;
  onResetAllFilters: () => void;
  onNavigate: (route: AppRouteId) => void;
}

const ALL_CATEGORY_IDS: ProductCategory[] = [
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

export function MarketplaceFoundationPage({
  selectedCategory,
  selectedDistrict,
  favoriteIds,
  onSelectCategory,
  onSelectDistrict,
  onToggleFavorite,
  onSelectProduct,
  onQuickAdd,
  onResetAllFilters,
  onNavigate,
}: MarketplaceFoundationPageProps) {
  const { t } = useTranslation();
  const catalogSectionRef = useRef<HTMLElement | null>(null);

  const [products, setProducts] = useState<ShowcaseProduct[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedDietary, setSelectedDietary] = useState<DietaryOption | 'all'>('all');
  const [fastOnly, setFastOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetchShowcaseCatalog({
        category: selectedCategory,
        district: selectedDistrict,
        dietary: selectedDietary,
        fastOnly,
        sort: 'popular',
      });
      setProducts(response.items);
      setCategories(response.categories);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : t.marketplace.errorTitle);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedDistrict, selectedDietary, fastOnly, t.marketplace.errorTitle]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const visibleProducts = useMemo(() => {
    if (!favoritesOnly) return products;
    return products.filter((p) => favoriteIds.includes(p.id));
  }, [products, favoritesOnly, favoriteIds]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedDistrict !== 'all' ||
    selectedDietary !== 'all' ||
    fastOnly ||
    favoritesOnly;

  const handleReset = () => {
    setFavoritesOnly(false);
    setSelectedDietary('all');
    setFastOnly(false);
    onResetAllFilters();
  };

  const scrollToCatalog = () => {
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      {/* Section 1: Full-Bleed Edge-to-Edge Animated Home Hero */}
      <HeroCarouselBanner
        onExploreProducts={scrollToCatalog}
        onOpenBakeries={() => onNavigate('artisans')}
      />

      {/* Section 2: Storefront Workspace */}
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <DesktopSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              onSelectCategory(cat);
              setFavoritesOnly(false);
            }}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={onSelectDistrict}
            selectedDietary={selectedDietary}
            onSelectDietary={setSelectedDietary}
            fastOnly={fastOnly}
            onToggleFastOnly={() => setFastOnly((prev) => !prev)}
            favoritesOnly={favoritesOnly}
            favoritesCount={favoriteIds.length}
            onToggleFavoritesOnly={() => setFavoritesOnly((prev) => !prev)}
            onOpenBakeries={() => onNavigate('artisans')}
          />

          <div className="flex-1 min-w-0 space-y-10">
            {/* Responsive 11-Category Quick Filter Strip */}
            <section className="space-y-4">
              <SectionHeader
                title={t.marketplace.categoriesHeading}
                subtitle={t.marketplace.categoriesSubheading}
              />

              <div
                role="tablist"
                aria-label={t.marketplace.categoriesHeading}
                className="flex items-center gap-1.5 overflow-x-auto pb-2"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === 'all'}
                  onClick={() => {
                    onSelectCategory('all');
                    setFavoritesOnly(false);
                  }}
                  className={[
                    'px-3.5 py-2 text-xs font-medium rounded-[10px] border whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sm-focus-ring)]',
                    selectedCategory === 'all'
                      ? 'bg-[var(--sm-accent-primary)] text-[var(--sm-text-inverse)] border-transparent'
                      : 'bg-[var(--sm-bg-surface)] sm-lens text-[var(--sm-text-secondary)] border-[var(--sm-border-subtle)] hover:text-[var(--sm-text-primary)] hover:border-[var(--sm-border-strong)]',
                  ].join(' ')}
                >
                  {t.sidebar.allCategories}
                </button>

                {ALL_CATEGORY_IDS.map((categoryId) => {
                  const active = selectedCategory === categoryId;
                  return (
                    <button
                      key={categoryId}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => {
                        onSelectCategory(categoryId);
                        setFavoritesOnly(false);
                      }}
                      className={[
                        'px-3.5 py-2 text-xs font-medium rounded-[10px] border whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sm-focus-ring)]',
                        active
                          ? 'bg-[var(--sm-accent-primary)] text-[var(--sm-text-inverse)] border-transparent'
                          : 'bg-[var(--sm-bg-surface)] sm-lens text-[var(--sm-text-secondary)] border-[var(--sm-border-subtle)] hover:text-[var(--sm-text-primary)] hover:border-[var(--sm-border-strong)]',
                      ].join(' ')}
                    >
                      {t.categoriesMap[categoryId]}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Product Cards Grid */}
            <section ref={catalogSectionRef} className="space-y-6 scroll-mt-20">
              <SectionHeader
                title={
                  selectedCategory === 'all'
                    ? t.marketplace.featuredHeading
                    : t.categoriesMap[selectedCategory]
                }
                subtitle={t.marketplace.featuredSubheading}
                action={
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs tabular-nums text-[var(--sm-text-muted)]">
                      {visibleProducts.length} {t.marketplace.resultsCountLabel}
                    </span>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                        onClick={handleReset}
                      >
                        {t.marketplace.resetFilters}
                      </Button>
                    )}
                  </div>
                }
              />

              {isLoading ? (
                <div
                  aria-busy="true"
                  aria-label={t.marketplace.loadingMessage}
                  className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3"
                >
                  {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <Card key={idx} padding="none" className="overflow-hidden">
                      <div className="aspect-[4/3] bg-[var(--sm-bg-subtle)] animate-pulse" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 w-1/2 rounded bg-[var(--sm-bg-subtle)] animate-pulse" />
                        <div className="h-5 w-4/5 rounded bg-[var(--sm-bg-subtle)] animate-pulse" />
                        <div className="h-4 w-1/3 rounded bg-[var(--sm-bg-subtle)] animate-pulse" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : errorMessage ? (
                <Card padding="lg" className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-sans text-base font-semibold text-[var(--sm-status-danger)]">
                      {t.marketplace.errorTitle}
                    </h3>
                    <p className="text-sm text-[var(--sm-text-secondary)]">{errorMessage}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => void loadCatalog()}>
                    {t.marketplace.retryAction}
                  </Button>
                </Card>
              ) : visibleProducts.length === 0 ? (
                <Card padding="lg" tone="subtle" className="space-y-4 text-center">
                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h3 className="font-sans text-base font-semibold text-[var(--sm-text-primary)]">
                      {t.marketplace.emptyTitle}
                    </h3>
                    <p className="text-sm text-[var(--sm-text-secondary)]">
                      {t.marketplace.emptyBody}
                    </p>
                  </div>
                  {hasActiveFilters && (
                    <div>
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        {t.marketplace.resetFilters}
                      </Button>
                    </div>
                  )}
                </Card>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
                  {visibleProducts.map((product) => (
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
            </section>

            <Divider />

            {/* Section 3: Customer Trust & Quality Standards */}
            <section className="space-y-6">
              <SectionHeader
                title={t.marketplace.principlesHeading}
                subtitle={t.marketplace.principlesSubheading}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {t.marketplace.principles.map((principle) => (
                  <Card key={principle.title} padding="md" tone="subtle" className="space-y-2">
                    <h3 className="font-sans text-base font-semibold text-[var(--sm-text-primary)]">
                      {principle.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--sm-text-secondary)]">
                      {principle.body}
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
