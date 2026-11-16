import React from 'react';
import { ArrowRight, Heart, Store } from 'lucide-react';
import { ProductCard } from '../components/catalog/ProductCard';
import { Button, Card, Divider, SectionHeader } from '../design-system/ui';
import { useTranslation } from '../hooks/useTranslation';
import { BakerySummary, ShowcaseProduct } from '../types';

export interface FavoritesPageProps {
  allProducts: ShowcaseProduct[];
  bakeries: BakerySummary[];
  favoriteIds: string[];
  followedBakeryIds: string[];
  onToggleFavorite: (productId: string) => void;
  onToggleFollowBakery: (bakeryId: string) => void;
  onSelectProduct: (product: ShowcaseProduct) => void;
  onQuickAdd: (product: ShowcaseProduct) => void;
  onViewBakeryProducts: (bakeryId: string) => void;
  onExploreCatalog: () => void;
  onExploreBakeries: () => void;
}

export function FavoritesPage({
  allProducts,
  bakeries,
  favoriteIds,
  followedBakeryIds,
  onToggleFavorite,
  onToggleFollowBakery,
  onSelectProduct,
  onQuickAdd,
  onViewBakeryProducts,
  onExploreCatalog,
  onExploreBakeries,
}: FavoritesPageProps) {
  const { locale, t } = useTranslation();

  const favoriteProducts = allProducts.filter((p) => favoriteIds.includes(p.id));
  const followedBakeries = bakeries.filter((b) => followedBakeryIds.includes(b.id));

  return (
    <div className="space-y-10 py-8 sm:py-12">
      <SectionHeader
        as="h1"
        title={t.favorites.heading}
        subtitle={t.favorites.subheading}
      />

      {/* Saved Products */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-[var(--sm-accent-primary)]" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-[var(--sm-text-primary)]">
            {t.favorites.savedProductsTitle}
          </h2>
        </div>

        {favoriteProducts.length === 0 ? (
          <Card padding="lg" tone="subtle" className="space-y-4 text-center">
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="font-sans text-base font-semibold text-[var(--sm-text-primary)]">
                {t.favorites.emptyTitle}
              </h3>
              <p className="text-sm text-[var(--sm-text-secondary)]">
                {t.favorites.emptyBody}
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={onExploreCatalog}>
              {t.favorites.exploreCatalogAction}
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectProduct}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        )}
      </section>

      <Divider />

      {/* Followed Brands */}
      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[var(--sm-accent-primary)]" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-[var(--sm-text-primary)]">
              {t.favorites.followedBakeriesTitle}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onExploreBakeries}>
            {t.favorites.openBakeriesAction}
          </Button>
        </div>

        {followedBakeries.length === 0 ? (
          <Card padding="md" tone="subtle">
            <p className="text-sm text-[var(--sm-text-secondary)]">
              {t.favorites.emptyBakeriesNote}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {followedBakeries.map((bakery) => (
              <Card key={bakery.id} padding="md" className="space-y-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--sm-text-primary)]">
                    {bakery.name}
                  </h3>
                  <p className="text-xs text-[var(--sm-text-muted)]">
                    {bakery.district[locale]} · {bakery.workingHours}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => onViewBakeryProducts(bakery.id)}
                  >
                    {t.artisans.viewProductsAction}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleFollowBakery(bakery.id)}
                  >
                    {t.artisans.followingBakery}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
