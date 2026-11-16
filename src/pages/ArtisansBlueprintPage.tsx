import React from 'react';
import { ArrowRight, CakeSlice, Check, Clock, MapPin, ShieldCheck, Star } from 'lucide-react';
import { PRODUCT_MEDIA_MAP } from '../assets/productMedia';
import { Button, Card, MediaFrame, SectionHeader } from '../design-system/ui';
import { useTranslation } from '../hooks/useTranslation';
import { BakerySummary } from '../types';
import { formatUzsPrice } from '../components/catalog/ProductCard';

export interface ArtisansBlueprintPageProps {
  bakeries: BakerySummary[];
  followedBakeryIds: string[];
  onToggleFollowBakery: (bakeryId: string) => void;
  onViewBakeryProducts: (bakeryId: string) => void;
  onOpenBakeryProfile: (bakery: BakerySummary) => void;
  onOpenCustomCake: (bakery: BakerySummary) => void;
}

export function ArtisansBlueprintPage({
  bakeries,
  followedBakeryIds,
  onToggleFollowBakery,
  onViewBakeryProducts,
  onOpenBakeryProfile,
  onOpenCustomCake,
}: ArtisansBlueprintPageProps) {
  const { locale, t } = useTranslation();

  return (
    <div className="space-y-8 py-8 sm:py-12">
      <SectionHeader
        as="h1"
        title={t.artisans.heading}
        subtitle={t.artisans.subheading}
      />

      {/* Renowned Samarkand Confectionery Brands */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {bakeries.map((bakery) => {
          const isFollowing = followedBakeryIds.includes(bakery.id);
          return (
            <Card
              key={bakery.id}
              padding="none"
              className="overflow-hidden flex flex-col justify-between"
            >
              <div>
                <button
                  type="button"
                  onClick={() => onOpenBakeryProfile(bakery)}
                  className="block w-full text-left cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sm-focus-ring)]"
                >
                  <MediaFrame
                    src={PRODUCT_MEDIA_MAP[bakery.coverMediaKey]}
                    alt={bakery.name}
                    aspectRatio="16/9"
                    className="group-hover:opacity-95 transition-opacity"
                  />
                </button>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium text-[var(--sm-accent-primary)]">
                        {t.artisans.sellerTypeLabels[bakery.sellerType]}
                      </p>
                      <button
                        type="button"
                        onClick={() => onOpenBakeryProfile(bakery)}
                        className="text-left cursor-pointer hover:text-[var(--sm-accent-primary)] transition-colors"
                      >
                        <h2 className="font-display text-xl font-semibold text-[var(--sm-text-primary)] mt-0.5">
                          {bakery.name}
                        </h2>
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold tabular-nums text-[var(--sm-text-primary)] shrink-0">
                      <Star
                        className="w-3.5 h-3.5 text-[var(--sm-accent-gold)]"
                        fill="currentColor"
                        aria-hidden="true"
                      />
                      <span>{bakery.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-[var(--sm-text-secondary)]">
                    {bakery.bio[locale]}
                  </p>

                  <div className="space-y-1.5 text-xs text-[var(--sm-text-secondary)] pt-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[var(--sm-text-muted)] shrink-0" />
                      <span className="truncate">
                        {bakery.district[locale]} · {bakery.address[locale]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-[var(--sm-text-muted)] shrink-0" />
                      <span>{bakery.workingHours}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          bakery.isOpenNow
                            ? 'font-medium text-[var(--sm-status-success)]'
                            : 'text-[var(--sm-text-muted)]'
                        }
                      >
                        {bakery.isOpenNow ? t.artisans.openNow : t.artisans.closedNow}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[var(--sm-text-muted)] pt-0.5">
                      {bakery.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[var(--sm-text-primary)] font-medium">
                          <ShieldCheck
                            className="w-3.5 h-3.5 text-[var(--sm-status-success)]"
                            aria-hidden="true"
                          />
                          {t.artisans.verifiedSeller}
                        </span>
                      )}
                      {bakery.acceptsCustomOrders && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{t.artisans.customOrdersSupported}</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {bakery.productCount} {t.artisans.productsCountUnit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-[var(--sm-border-subtle)] space-y-3">
                <p className="text-xs text-[var(--sm-text-muted)] tabular-nums">
                  {t.artisans.deliveryFromLabel}:{' '}
                  <span className="font-mono font-medium text-[var(--sm-text-primary)]">
                    {formatUzsPrice(bakery.deliveryFeeUzs)} {t.common.currencyUzs}
                  </span>{' '}
                  · {formatUzsPrice(bakery.freeDeliveryFromUzs)} {t.common.currencyUzs}{' '}
                  {t.artisans.freeFromLabel}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => onViewBakeryProducts(bakery.id)}
                  >
                    {t.artisans.viewProductsAction}
                  </Button>

                  <div className="grid w-full grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => onOpenBakeryProfile(bakery)}
                    >
                      {t.artisans.openProfileAction}
                    </Button>

                    {bakery.acceptsCustomOrders ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        fullWidth
                        leftIcon={<CakeSlice className="w-3.5 h-3.5" />}
                        onClick={() => onOpenCustomCake(bakery)}
                      >
                        {t.artisans.orderCustomCakeAction}
                      </Button>
                    ) : (
                      <Button
                        variant={isFollowing ? 'secondary' : 'outline'}
                        size="sm"
                        fullWidth
                        leftIcon={isFollowing ? <Check className="w-3.5 h-3.5" /> : undefined}
                        onClick={() => onToggleFollowBakery(bakery.id)}
                      >
                        {isFollowing ? t.artisans.followingBakery : t.artisans.followBakery}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
