import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { PRODUCT_MEDIA_MAP } from '../assets/productMedia';
import { formatUzsPrice, ProductCard } from '../components/catalog/ProductCard';
import { Button, Card, Divider, MediaFrame, TextInput } from '../design-system/ui';
import { useTranslation } from '../hooks/useTranslation';
import { BakerySummary, ProductVariantItem, ShowcaseProduct } from '../types';

export interface ProductDetailPageProps {
  product: ShowcaseProduct;
  bakery?: BakerySummary;
  relatedProducts: ShowcaseProduct[];
  isFavorite: boolean;
  favoriteIds: string[];
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (input: {
    product: ShowcaseProduct;
    variant: ProductVariantItem;
    quantity: number;
    customNote: string;
  }) => void;
  onQuickAdd: (product: ShowcaseProduct) => void;
  onOpenCart: () => void;
  onSelectProduct: (product: ShowcaseProduct) => void;
  onOpenBakeryProfile?: (bakery: BakerySummary) => void;
  onBack: () => void;
}

export function ProductDetailPage({
  product,
  bakery,
  relatedProducts,
  isFavorite,
  favoriteIds,
  onToggleFavorite,
  onAddToCart,
  onQuickAdd,
  onOpenCart,
  onSelectProduct,
  onOpenBakeryProfile,
  onBack,
}: ProductDetailPageProps) {
  const { locale, t } = useTranslation();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id ?? '',
  );
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedVariantId(product.variants[0]?.id ?? '');
    setQuantity(1);
    setCustomNote('');
    setJustAdded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const title = product.title[locale];
  const description = product.description[locale];
  const district = product.district[locale];
  const categoryLabel = t.categoriesMap[product.category];
  const dietaryText = product.dietaryTags.map((tag) => t.dietaryMap[tag]).join(' · ');

  const gallery = product.galleryKeys.length > 0 ? product.galleryKeys : [product.mediaKey];
  const activeMediaKey = gallery[selectedImageIndex] ?? product.mediaKey;

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];
  const totalItemPrice = (activeVariant?.priceUzs ?? product.priceUzs) * quantity;

  const handleAdd = () => {
    if (!activeVariant) return;
    onAddToCart({
      product,
      variant: activeVariant,
      quantity,
      customNote,
    });
    setJustAdded(true);
  };

  return (
    <div className="space-y-10 py-6 sm:py-10">
      {/* Top Navigation & Actions Bar */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onBack}
        >
          {t.productCard.backToCatalog}
        </Button>

        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          aria-pressed={isFavorite}
          className={[
            'inline-flex items-center gap-2 rounded-[10px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] sm-lens px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors',
            isFavorite
              ? 'text-[var(--sm-accent-primary)]'
              : 'text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)]',
          ].join(' ')}
        >
          <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
          <span>
            {isFavorite ? t.productCard.removeFavorite : t.productCard.addFavorite}
          </span>
        </button>
      </div>

      {/* Main 2-Column Spacious Product Showcase */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Gallery + Bakery Details Card */}
        <div className="lg:col-span-6 space-y-5">
          <Card padding="sm" className="space-y-3">
            <MediaFrame
              src={PRODUCT_MEDIA_MAP[activeMediaKey]}
              alt={title}
              aspectRatio="4/3"
              className="rounded-[14px]"
            />

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2.5">
                {gallery.map((mediaKey, idx) => {
                  const isActive = idx === selectedImageIndex;
                  return (
                    <button
                      key={`${mediaKey}-${idx}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      aria-label={`${title} ${idx + 1}`}
                      aria-pressed={isActive}
                      className={[
                        'overflow-hidden rounded-[10px] border transition-all cursor-pointer aspect-[4/3]',
                        isActive
                          ? 'border-[var(--sm-accent-primary)] ring-2 ring-[var(--sm-accent-primary)]/30'
                          : 'border-[var(--sm-border-subtle)] opacity-75 hover:opacity-100',
                      ].join(' ')}
                    >
                      <img
                        src={PRODUCT_MEDIA_MAP[mediaKey]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Bakery Info Card */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-[var(--sm-text-muted)]">
                  {t.productCard.bakeryLabel}
                </p>
                <h2 className="font-display text-xl font-semibold text-[var(--sm-text-primary)]">
                  {product.bakeryName}
                </h2>
              </div>

              <span
                className={
                  product.bakeryOpenNow
                    ? 'text-xs font-semibold text-[var(--sm-status-success)]'
                    : 'text-xs text-[var(--sm-text-muted)]'
                }
              >
                {product.bakeryOpenNow ? t.productCard.openNow : t.productCard.closedNow}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--sm-text-secondary)]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[var(--sm-accent-primary)] shrink-0" />
                <span>{bakery ? `${bakery.district[locale]} · ${bakery.address[locale]}` : district}</span>
              </div>
              <div className="flex items-center gap-2 tabular-nums">
                <Clock className="w-3.5 h-3.5 text-[var(--sm-accent-primary)] shrink-0" />
                <span>
                  {t.productCard.workingHoursLabel}: {product.bakeryWorkingHours}
                </span>
              </div>
            </div>

            {bakery && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--sm-border-subtle)] text-xs">
                <span className="text-[var(--sm-text-muted)] tabular-nums">
                  {t.artisans.deliveryFromLabel}:{' '}
                  <strong className="font-mono text-[var(--sm-text-primary)]">
                    {formatUzsPrice(bakery.deliveryFeeUzs)} {t.common.currencyUzs}
                  </strong>{' '}
                  · {formatUzsPrice(bakery.freeDeliveryFromUzs)} {t.common.currencyUzs}{' '}
                  {t.artisans.freeFromLabel}
                </span>

                {onOpenBakeryProfile && (
                  <button
                    type="button"
                    onClick={() => onOpenBakeryProfile(bakery)}
                    className="font-semibold text-[var(--sm-accent-primary)] hover:underline cursor-pointer"
                  >
                    {t.productCard.openBakeryProfileCta}
                  </button>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Full Specifications, Variants & Purchase Module */}
        <div className="lg:col-span-6">
          <Card padding="lg" className="space-y-5">
            <div className="space-y-2.5">
              <p className="text-xs font-medium text-[var(--sm-text-muted)]">
                {categoryLabel} <span aria-hidden="true">·</span> {district}
                {dietaryText ? (
                  <>
                    {' '}
                    <span aria-hidden="true">·</span> {dietaryText}
                  </>
                ) : null}
              </p>

              <h1 className="font-display text-2xl sm:text-3xl font-semibold leading-snug text-[var(--sm-text-primary)]">
                {title}
              </h1>

              <div className="flex flex-wrap items-baseline justify-between gap-3 pt-1">
                <p className="font-mono text-2xl font-semibold tabular-nums text-[var(--sm-accent-primary)]">
                  {formatUzsPrice(totalItemPrice)} {t.common.currencyUzs}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-[var(--sm-text-secondary)] tabular-nums">
                  <Star
                    className="w-4 h-4 text-[var(--sm-accent-gold)]"
                    fill="currentColor"
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-[var(--sm-text-primary)]">
                    {product.rating.toFixed(1)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {product.reviewCount} {t.productCard.reviewsUnit}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-[var(--sm-text-secondary)]">
              {description}
            </p>

            {/* Detailed Specifications Grid */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-[14px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-subtle)] p-4 text-xs">
              <div>
                <dt className="text-[var(--sm-text-muted)]">{t.productCard.preparationLabel}</dt>
                <dd className="font-semibold tabular-nums text-[var(--sm-text-primary)] mt-1">
                  {product.prepHours} {t.productCard.prepTimeSuffix}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--sm-text-muted)]">{t.productCard.storageLabel}</dt>
                <dd className="font-semibold text-[var(--sm-text-primary)] mt-1">
                  {t.productCard.storageByCategory[product.category]}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[var(--sm-text-muted)]">{t.productCard.ingredientsLabel}</dt>
                <dd className="leading-relaxed text-[var(--sm-text-primary)] mt-1">
                  {t.productCard.ingredientsByCategory[product.category]}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[var(--sm-text-muted)]">{t.productCard.deliveryPolicyLabel}</dt>
                <dd className="leading-relaxed text-[var(--sm-text-secondary)] mt-1">
                  {t.productCard.deliveryPolicyValue}
                </dd>
              </div>
            </dl>

            <Divider />

            {/* Variant Selector */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-[var(--sm-text-primary)]">
                {t.productCard.selectVariant}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.variants.map((variant) => {
                  const selected = variant.id === activeVariant?.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setJustAdded(false);
                      }}
                      aria-pressed={selected}
                      className={[
                        'flex items-center justify-between gap-2 rounded-[10px] border px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer',
                        selected
                          ? 'border-[var(--sm-accent-primary)] bg-[var(--sm-accent-primary-soft)] text-[var(--sm-text-primary)] font-semibold'
                          : 'border-[var(--sm-border-subtle)] bg-[var(--sm-bg-subtle)] text-[var(--sm-text-secondary)] hover:border-[var(--sm-border-strong)]',
                      ].join(' ')}
                    >
                      <span className="truncate">{variant.label[locale]}</span>
                      <span className="font-mono tabular-nums shrink-0">
                        {formatUzsPrice(variant.priceUzs)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Custom Note */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
              <div className="sm:col-span-4 space-y-1.5">
                <span className="block text-xs font-medium text-[var(--sm-text-primary)]">
                  {t.productCard.quantityLabel}
                </span>
                <div className="inline-flex h-[42px] w-full items-center justify-between rounded-[8px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-subtle)] px-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((q) => Math.max(1, q - 1));
                      setJustAdded(false);
                    }}
                    aria-label="-"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--sm-text-secondary)] hover:bg-[var(--sm-bg-surface)] cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-sm font-semibold tabular-nums text-[var(--sm-text-primary)]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((q) => Math.min(20, q + 1));
                      setJustAdded(false);
                    }}
                    aria-label="+"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--sm-text-secondary)] hover:bg-[var(--sm-bg-surface)] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="sm:col-span-8">
                <TextInput
                  label={t.productCard.customNoteLabel}
                  placeholder={t.productCard.customNotePlaceholder}
                  value={customNote}
                  maxLength={160}
                  onChange={(e) => {
                    setCustomNote(e.target.value);
                    setJustAdded(false);
                  }}
                />
              </div>
            </div>

            {justAdded && (
              <div className="flex items-center justify-between gap-3 rounded-[10px] border border-[var(--sm-status-success)]/35 bg-[var(--sm-status-success)]/10 px-4 py-2.5 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-[var(--sm-status-success)]">
                  <Check className="w-4 h-4" />
                  {t.productCard.addedConfirmation}
                </span>
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="font-semibold text-[var(--sm-accent-primary)] hover:underline cursor-pointer"
                >
                  {t.productCard.goToCart}
                </button>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<ShoppingBag className="w-4 h-4" />}
              onClick={handleAdd}
            >
              {t.productCard.addToCart} · {formatUzsPrice(totalItemPrice)}{' '}
              {t.common.currencyUzs}
            </Button>
          </Card>
        </div>
      </div>

      {/* Related Products Full Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-5 pt-4 border-t border-[var(--sm-border-subtle)]">
          <h2 className="font-display text-2xl font-semibold text-[var(--sm-text-primary)]">
            {t.productCard.relatedProductsHeading}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                isFavorite={favoriteIds.includes(rel.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectProduct}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
