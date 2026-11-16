import React, { useState } from 'react';
import { Eye, Play, ShoppingBag, X } from 'lucide-react';
import { PRODUCT_MEDIA_MAP } from '../../assets/productMedia';
import { Button } from '../../design-system/ui';
import { useTranslation } from '../../hooks/useTranslation';
import { BakeryReel, ShowcaseProduct } from '../../types';
import { formatUzsPrice } from './ProductCard';

export interface ReelsStripProps {
  reels: BakeryReel[];
  allProducts: ShowcaseProduct[];
  onViewProduct: (product: ShowcaseProduct) => void;
  onQuickAdd: (product: ShowcaseProduct) => void;
  hideHeader?: boolean;
}

export function ReelsStrip({
  reels,
  allProducts,
  onViewProduct,
  onQuickAdd,
  hideHeader = false,
}: ReelsStripProps) {
  const { locale, t } = useTranslation();
  const [activeReel, setActiveReel] = useState<BakeryReel | null>(null);

  if (reels.length === 0) return null;

  const activeProduct = activeReel
    ? allProducts.find((p) => p.id === activeReel.featuredProductId)
    : undefined;

  const gridColsClass =
    reels.length <= 2
      ? 'grid grid-cols-2 gap-3 sm:gap-4'
      : 'grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4';

  return (
    <>
      <section
        aria-label={t.catalog.reelsHeading}
        className="rounded-[20px] sm:rounded-[22px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] sm-lens p-3 sm:p-5 space-y-3"
      >
        {!hideHeader && (
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-lg sm:text-xl font-semibold text-[var(--sm-text-primary)]">
              {t.catalog.reelsHeading}
            </h2>
            <p className="text-xs text-[var(--sm-text-muted)]">
              {t.catalog.reelsSubheading}
            </p>
          </div>
        )}

        <div className={gridColsClass}>
          {reels.map((reel) => (
            <button
              key={reel.id}
              type="button"
              onClick={() => setActiveReel(reel)}
              className="group relative aspect-[9/12] sm:aspect-[9/13] overflow-hidden rounded-[16px] sm:rounded-[18px] border border-[var(--sm-border-subtle)] bg-[#161311] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sm-focus-ring)]"
            >
              <img
                src={PRODUCT_MEDIA_MAP[reel.mediaKey]}
                alt={reel.title[locale]}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

              {/* Top Duration & Play Icon */}
              <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between text-white">
                <span className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-[11px] font-medium tabular-nums">
                  <Play className="w-3 h-3" fill="currentColor" aria-hidden="true" />
                  {reel.durationSec} {t.catalog.reelsDurationUnit}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-[11px] tabular-nums text-white/85">
                  <Eye className="w-3 h-3" aria-hidden="true" />
                  {reel.viewsCount.toLocaleString()}
                </span>
              </div>

              {/* Bottom Title & Bakery */}
              <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3 sm:bottom-3 space-y-0.5 sm:space-y-1">
                <p className="text-[10px] sm:text-[11px] font-medium text-[#f2b8a8] truncate">
                  {reel.bakeryName}
                </p>
                <p className="text-xs sm:text-sm font-semibold leading-snug text-white line-clamp-2">
                  {reel.title[locale]}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Active Reel Spotlight Modal */}
      {activeReel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={activeReel.title[locale]}
        >
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setActiveReel(null)}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[26px] border border-white/25 bg-[#161311] shadow-2xl aspect-[9/15] max-h-[88vh] flex flex-col justify-between">
            <img
              src={PRODUCT_MEDIA_MAP[activeReel.mediaKey]}
              alt={activeReel.title[locale]}
              className="absolute inset-0 h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/85 pointer-events-none" />

            <div className="relative z-20 p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {activeReel.bakeryName}
                </p>
                <p className="text-[11px] text-white/80 tabular-nums">
                  {activeReel.bakeryDistrict[locale]} · {activeReel.viewsCount.toLocaleString()}{' '}
                  {t.catalog.reelsViewsUnit} · {activeReel.durationSec} {t.catalog.reelsDurationUnit}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveReel(null)}
                aria-label={t.catalog.storyClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white backdrop-blur-md hover:bg-black/60 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative z-20 p-4 space-y-3">
              <p className="text-sm leading-relaxed text-white font-medium">
                {activeReel.title[locale]}
              </p>

              {activeProduct && (
                <div className="rounded-[16px] border border-white/25 bg-black/50 p-3 backdrop-blur-2xl space-y-2.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={PRODUCT_MEDIA_MAP[activeProduct.mediaKey]}
                      alt=""
                      className="h-12 w-14 rounded-[10px] object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white line-clamp-1">
                        {activeProduct.title[locale]}
                      </p>
                      <p className="font-mono text-xs tabular-nums text-[#f2b8a8] mt-0.5">
                        {formatUzsPrice(activeProduct.priceUzs)} {t.common.currencyUzs}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                      onClick={() => {
                        onQuickAdd(activeProduct);
                        setActiveReel(null);
                      }}
                    >
                      {t.catalog.storyAddCart}
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveReel(null);
                        onViewProduct(activeProduct);
                      }}
                      className="inline-flex items-center justify-center rounded-[8px] border border-white/25 bg-white/12 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 cursor-pointer"
                    >
                      {t.catalog.storyViewProduct}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
