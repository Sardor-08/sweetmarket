import React, { useEffect, useState } from 'react';
import { Check, Heart, Minus, Plus, ShoppingBag, Star, X } from 'lucide-react';
import { PRODUCT_MEDIA_MAP } from '../../assets/productMedia';
import { Button, Divider, MediaFrame, TextInput } from '../../design-system/ui';
import { useTranslation } from '../../hooks/useTranslation';
import { ProductVariantItem, ShowcaseProduct } from '../../types';
import { formatUzsPrice } from './ProductCard';

export interface ProductQuickViewModalProps {
  product: ShowcaseProduct | null;
  relatedProducts: ShowcaseProduct[];
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (input: {
    product: ShowcaseProduct;
    variant: ProductVariantItem;
    quantity: number;
    customNote: string;
  }) => void;
  onOpenCart: () => void;
  onSelectProduct: (product: ShowcaseProduct) => void;
  onClose: () => void;
}

export function ProductQuickViewModal({
  product,
  relatedProducts,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onOpenCart,
  onSelectProduct,
  onClose,
}: ProductQuickViewModalProps) {
  const { locale, t } = useTranslation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!product) return;
    setSelectedImageIndex(0);
    setSelectedVariantId(product.variants[0]?.id ?? '');
    setQuantity(1);
    setCustomNote('');
    setJustAdded(false);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-quickview-title"
    >
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[14px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-elevated)] sm-lens shadow-xl max-h-[92vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Main Image + Gallery Thumbnails */}
          <div className="md:col-span-5 bg-[var(--sm-bg-subtle)]/50 p-4 flex flex-col gap-3">
            <MediaFrame
              src={PRODUCT_MEDIA_MAP[activeMediaKey]}
              alt={title}
              aspectRatio="4/3"
              className="rounded-[10px]"
            />

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
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
                        'overflow-hidden rounded-[7px] border transition-all cursor-pointer aspect-[4/3]',
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

            <div className="mt-auto pt-2 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[var(--sm-text-secondary)]">
                <span>{t.productCard.workingHoursLabel}</span>
                <span className="font-mono tabular-nums">{product.bakeryWorkingHours}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--sm-text-muted)]">{product.bakeryName}</span>
                <span
                  className={
                    product.bakeryOpenNow
                      ? 'font-medium text-[var(--sm-status-success)]'
                      : 'text-[var(--sm-text-muted)]'
                  }
                >
                  {product.bakeryOpenNow ? t.productCard.openNow : t.productCard.closedNow}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Variants, Quantity, Custom Note, Add to Cart */}
          <div className="md:col-span-7 p-6 flex flex-col justify-between gap-5">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-medium text-[var(--sm-text-muted)]">
                  {categoryLabel} <span aria-hidden="true">·</span> {district}
                </p>
                <div className="flex items-center gap-1 -mt-1 -mr-1">
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(product.id)}
                    aria-pressed={isFavorite}
                    aria-label={
                      isFavorite
                        ? t.productCard.removeFavorite
                        : t.productCard.addFavorite
                    }
                    className={[
                      'inline-flex items-center justify-center w-9 h-9 rounded-[8px] hover:bg-[var(--sm-bg-subtle)] cursor-pointer transition-colors',
                      isFavorite
                        ? 'text-[var(--sm-accent-primary)]'
                        : 'text-[var(--sm-text-secondary)]',
                    ].join(' ')}
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={isFavorite ? 'currentColor' : 'none'}
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label={t.productCard.closePreview}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-[8px] text-[var(--sm-text-secondary)] hover:bg-[var(--sm-bg-subtle)] cursor-pointer"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <h2
                id="product-quickview-title"
                className="font-display text-2xl font-semibold leading-snug text-[var(--sm-text-primary)]"
              >
                {title}
              </h2>

              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-mono text-xl font-semibold tabular-nums text-[var(--sm-accent-primary)]">
                  {formatUzsPrice(totalItemPrice)} {t.common.currencyUzs}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[var(--sm-text-secondary)] tabular-nums">
                  <Star
                    className="w-3.5 h-3.5 text-[var(--sm-accent-gold)]"
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

              <p className="text-sm leading-relaxed text-[var(--sm-text-secondary)]">
                {description}
              </p>

              {/* Metadata row */}
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pt-1">
                <div>
                  <dt className="text-[var(--sm-text-muted)]">{t.productCard.preparationLabel}</dt>
                  <dd className="font-semibold tabular-nums text-[var(--sm-text-primary)] mt-0.5">
                    {product.prepHours} {t.productCard.prepTimeSuffix}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--sm-text-muted)]">{t.productCard.dietaryLabel}</dt>
                  <dd className="font-semibold text-[var(--sm-text-primary)] mt-0.5">
                    {dietaryText}
                  </dd>
                </div>
              </dl>

              <Divider />

              {/* Variant Selector */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[var(--sm-text-primary)]">
                  {t.productCard.selectVariant}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                          'flex items-center justify-between gap-2 rounded-[8px] border px-3 py-2 text-left text-xs transition-colors cursor-pointer',
                          selected
                            ? 'border-[var(--sm-accent-primary)] bg-[var(--sm-accent-primary-soft)] text-[var(--sm-text-primary)] font-semibold'
                            : 'border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] text-[var(--sm-text-secondary)] hover:border-[var(--sm-border-strong)]',
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
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4 space-y-1.5">
                  <span className="block text-xs font-medium text-[var(--sm-text-primary)]">
                    {t.productCard.quantityLabel}
                  </span>
                  <div className="inline-flex h-[42px] w-full items-center justify-between rounded-[8px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] px-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setQuantity((q) => Math.max(1, q - 1));
                        setJustAdded(false);
                      }}
                      aria-label="-"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--sm-text-secondary)] hover:bg-[var(--sm-bg-subtle)] cursor-pointer"
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
                      className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--sm-text-secondary)] hover:bg-[var(--sm-bg-subtle)] cursor-pointer"
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
            </div>

            {/* Primary Add to Cart Actions */}
            <div className="space-y-2.5 pt-2">
              {justAdded && (
                <div className="flex items-center justify-between gap-3 rounded-[8px] border border-[var(--sm-status-success)]/35 bg-[var(--sm-status-success)]/10 px-3.5 py-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-medium text-[var(--sm-status-success)]">
                    <Check className="w-3.5 h-3.5" />
                    {t.productCard.addedConfirmation}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCart();
                    }}
                    className="font-semibold text-[var(--sm-accent-primary)] hover:underline cursor-pointer"
                  >
                    {t.productCard.goToCart}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <Button
                  variant="primary"
                  fullWidth
                  leftIcon={<ShoppingBag className="w-4 h-4" />}
                  onClick={handleAdd}
                >
                  {t.productCard.addToCart} · {formatUzsPrice(totalItemPrice)}{' '}
                  {t.common.currencyUzs}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Strip */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[var(--sm-border-subtle)] bg-[var(--sm-bg-subtle)]/40 p-5 space-y-3">
            <h3 className="font-sans text-xs font-semibold text-[var(--sm-text-muted)]">
              {t.productCard.relatedProductsHeading}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedProducts.map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => onSelectProduct(rel)}
                  className="flex items-center gap-3 rounded-[10px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] p-2.5 text-left hover:border-[var(--sm-border-strong)] transition-colors cursor-pointer"
                >
                  <img
                    src={PRODUCT_MEDIA_MAP[rel.mediaKey]}
                    alt=""
                    className="h-14 w-16 rounded-[6px] object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--sm-text-primary)] line-clamp-2">
                      {rel.title[locale]}
                    </p>
                    <p className="font-mono text-[11px] tabular-nums text-[var(--sm-accent-primary)] mt-0.5">
                      {formatUzsPrice(rel.priceUzs)} {t.common.currencyUzs}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
