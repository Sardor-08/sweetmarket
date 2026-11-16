import React, { useState } from 'react';
import { Check, Heart, Plus, Star } from 'lucide-react';
import { PRODUCT_MEDIA_MAP } from '../../assets/productMedia';
import { Button, Card, MediaFrame } from '../../design-system/ui';
import { useTranslation } from '../../hooks/useTranslation';
import { ShowcaseProduct } from '../../types';

export interface ProductCardProps {
  product: ShowcaseProduct;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  onSelect: (product: ShowcaseProduct) => void;
  onQuickAdd?: (product: ShowcaseProduct) => void;
}

export function formatUzsPrice(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onSelect,
  onQuickAdd,
}: ProductCardProps) {
  const { locale, t } = useTranslation();
  const [justAdded, setJustAdded] = useState(false);

  const title = product.title[locale];
  const district = product.district[locale];
  const categoryLabel = t.categoriesMap[product.category];
  const imageSrc = PRODUCT_MEDIA_MAP[product.mediaKey];
  const hasMultipleVariants = product.variants.length > 1;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onQuickAdd) {
      onSelect(product);
      return;
    }
    onQuickAdd(product);
    setJustAdded(true);
    window.setTimeout(() => {
      setJustAdded(false);
    }, 1400);
  };

  return (
    <Card
      padding="none"
      interactive
      className="group overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div className="relative">
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="block w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--sm-focus-ring)]"
            aria-label={title}
          >
            <MediaFrame
              src={imageSrc}
              alt={title}
              aspectRatio="4/3"
              imgClassName="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
            />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite ? t.productCard.removeFavorite : t.productCard.addFavorite
            }
            className={[
              'absolute top-2 right-2 sm:top-3 sm:right-3 inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-[8px]',
              'border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] sm-lens',
              'transition-colors duration-150 cursor-pointer',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sm-focus-ring)]',
              isFavorite
                ? 'text-[var(--sm-accent-primary)]'
                : 'text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)]',
            ].join(' ')}
          >
            <Heart
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill={isFavorite ? 'currentColor' : 'none'}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="p-3 pb-2 sm:p-5 sm:pb-3 space-y-1 sm:space-y-2">
          <p className="text-[11px] sm:text-xs font-medium text-[var(--sm-text-muted)] truncate">
            {categoryLabel} <span aria-hidden="true">·</span> {district}
          </p>

          <h3 className="font-sans text-[13px] sm:text-base font-semibold leading-snug text-[var(--sm-text-primary)] line-clamp-2 min-h-[2.25rem] sm:min-h-[2.75rem]">
            <button
              type="button"
              onClick={() => onSelect(product)}
              className="text-left hover:text-[var(--sm-accent-primary)] transition-colors cursor-pointer"
            >
              {title}
            </button>
          </h3>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[var(--sm-text-secondary)] tabular-nums min-w-0">
            <span className="inline-flex items-center gap-1 font-medium text-[var(--sm-text-primary)] shrink-0">
              <Star
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--sm-accent-gold)]"
                fill="currentColor"
                aria-hidden="true"
              />
              {product.rating.toFixed(1)}
            </span>
            <span aria-hidden="true" className="shrink-0">·</span>
            <span className="truncate">{product.bakeryName}</span>
            <span aria-hidden="true" className="hidden sm:inline shrink-0">·</span>
            <span
              className={[
                'hidden sm:inline shrink-0',
                product.bakeryOpenNow
                  ? 'text-[var(--sm-status-success)] font-medium'
                  : 'text-[var(--sm-text-muted)]',
              ].join(' ')}
            >
              {product.bakeryOpenNow ? t.productCard.openNow : t.productCard.closedNow}
            </span>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 pt-2.5 sm:px-5 sm:pb-5 sm:pt-3 border-t border-[var(--sm-border-subtle)] flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2.5">
        <div className="min-w-0">
          <p className="font-mono text-[13px] sm:text-[15px] font-semibold tabular-nums text-[var(--sm-text-primary)] truncate">
            {hasMultipleVariants && locale === 'ru' ? `${t.productCard.fromPricePrefix} ` : ''}
            {formatUzsPrice(product.priceUzs)} {t.common.currencyUzs}
            {hasMultipleVariants && locale === 'uz' ? ` ${t.productCard.fromPricePrefix}` : ''}
          </p>
          <p className="text-[10px] sm:text-[11px] text-[var(--sm-text-muted)] tabular-nums truncate">
            {product.weightGrams} {t.productCard.weightUnit} · {product.prepHours}{' '}
            {t.productCard.prepTimeSuffix}
            {hasMultipleVariants
              ? ` · ${product.variants.length} ${t.productCard.variantsUnit}`
              : ''}
          </p>
        </div>

        <div className="flex items-center shrink-0">
          <Button
            variant={justAdded ? 'secondary' : 'primary'}
            size="sm"
            className="w-full sm:w-auto"
            leftIcon={
              justAdded ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )
            }
            onClick={handleQuickAdd}
          >
            {justAdded ? t.productCard.addedShort : t.productCard.quickAdd}
          </Button>
        </div>
      </div>
    </Card>
  );
}
