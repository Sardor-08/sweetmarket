import React, { useEffect, useMemo, useState } from 'react';
import {
  CakeSlice,
  Check,
  Clock,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Star,
  X,
} from 'lucide-react';
import { PRODUCT_MEDIA_MAP } from '../../assets/productMedia';
import { Button, Divider, TextArea, TextInput } from '../../design-system/ui';
import { useTranslation } from '../../hooks/useTranslation';
import { fetchCompanyReviews, submitCompanyReview } from '../../services/api/client';
import { BakeryReview, BakerySummary, ShowcaseProduct } from '../../types';
import { formatUzsPrice } from '../catalog/ProductCard';

export interface CompanyProfileModalProps {
  bakery: BakerySummary | null;
  allProducts: ShowcaseProduct[];
  isFollowing: boolean;
  defaultAuthorName?: string;
  onToggleFollow: (bakeryId: string) => void;
  onSelectProduct: (product: ShowcaseProduct) => void;
  onQuickAdd: (product: ShowcaseProduct) => void;
  onOpenCustomCake: (bakery: BakerySummary) => void;
  onClose: () => void;
}

export function CompanyProfileModal({
  bakery,
  allProducts,
  isFollowing,
  defaultAuthorName = '',
  onToggleFollow,
  onSelectProduct,
  onQuickAdd,
  onOpenCustomCake,
  onClose,
}: CompanyProfileModalProps) {
  const { locale, t } = useTranslation();

  const [reviews, setReviews] = useState<BakeryReview[]>([]);
  const [avgRating, setAvgRating] = useState<number>(bakery?.rating ?? 5.0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const [authorName, setAuthorName] = useState(defaultAuthorName);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  useEffect(() => {
    if (!bakery) return;
    setAuthorName(defaultAuthorName);
    setRating(5);
    setComment('');
    setFormError(null);
    setSubmittedNotice(false);
    setAvgRating(bakery.rating);

    setIsLoadingReviews(true);
    void fetchCompanyReviews(bakery.id)
      .then((res) => {
        setReviews(res.items);
        if (res.items.length > 0) {
          setAvgRating(res.averageRating);
        }
      })
      .catch(() => setReviews([]))
      .finally(() => setIsLoadingReviews(false));
  }, [bakery?.id, defaultAuthorName]);

  useEffect(() => {
    if (!bakery) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [bakery, onClose]);

  const bakeryProducts = useMemo(() => {
    if (!bakery) return [];
    return allProducts.filter((p) => p.bakeryId === bakery.id);
  }, [bakery, allProducts]);

  if (!bakery) return null;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmittedNotice(false);

    if (authorName.trim().length < 2 || comment.trim().length < 5) {
      setFormError(t.artisans.reviewValidationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await submitCompanyReview(bakery.id, {
        authorName: authorName.trim(),
        rating,
        comment: comment.trim(),
      });
      setReviews((prev) => {
        const next = [created, ...prev];
        const nextAvg =
          next.reduce((sum, r) => sum + r.rating, 0) / next.length;
        setAvgRating(Number(nextAvg.toFixed(1)));
        return next;
      });
      setComment('');
      setRating(5);
      setSubmittedNotice(true);
    } catch {
      setFormError(t.artisans.reviewValidationError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="company-profile-title"
    >
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[20px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-elevated)] sm-lens shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Cover Banner */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          <img
            src={PRODUCT_MEDIA_MAP[bakery.coverMediaKey]}
            alt={bakery.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            aria-label={t.productCard.closePreview}
            className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/45 border border-white/25 text-white backdrop-blur-md hover:bg-black/65 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute inset-x-5 bottom-4 flex flex-wrap items-end justify-between gap-3 text-white">
            <div>
              <p className="text-xs font-medium text-[#f2b8a8]">
                {t.artisans.sellerTypeLabels[bakery.sellerType]}
              </p>
              <h2
                id="company-profile-title"
                className="font-display text-2xl sm:text-3xl font-semibold mt-0.5"
              >
                {bakery.name}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-sm font-semibold tabular-nums">
              <Star
                className="w-4 h-4 text-[var(--sm-accent-gold)]"
                fill="currentColor"
                aria-hidden="true"
              />
              <span>{avgRating.toFixed(1)}</span>
              <span className="text-white/75 text-xs">
                ({bakery.reviewCount + Math.max(0, reviews.length - 1)} {t.productCard.reviewsUnit})
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Bio & Actions */}
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-[var(--sm-text-secondary)]">
              {bakery.bio[locale]}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[var(--sm-text-secondary)]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[var(--sm-accent-primary)] shrink-0" />
                <span>
                  {bakery.district[locale]} · {bakery.address[locale]}
                </span>
              </div>
              <div className="flex items-center gap-2 tabular-nums">
                <Clock className="w-3.5 h-3.5 text-[var(--sm-accent-primary)] shrink-0" />
                <span>{bakery.workingHours}</span>
                <span aria-hidden="true">·</span>
                <span
                  className={
                    bakery.isOpenNow
                      ? 'font-semibold text-[var(--sm-status-success)]'
                      : 'text-[var(--sm-text-muted)]'
                  }
                >
                  {bakery.isOpenNow ? t.artisans.openNow : t.artisans.closedNow}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--sm-text-muted)]">
              {bakery.isVerified && (
                <span className="inline-flex items-center gap-1 font-medium text-[var(--sm-text-primary)]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--sm-status-success)]" />
                  {t.artisans.verifiedSeller}
                </span>
              )}
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {t.artisans.deliveryFromLabel}: {formatUzsPrice(bakery.deliveryFeeUzs)}{' '}
                {t.common.currencyUzs} ({formatUzsPrice(bakery.freeDeliveryFromUzs)}{' '}
                {t.common.currencyUzs} {t.artisans.freeFromLabel})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {bakery.acceptsCustomOrders && (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CakeSlice className="w-4 h-4" />}
                  onClick={() => {
                    onClose();
                    onOpenCustomCake(bakery);
                  }}
                >
                  {t.artisans.orderCustomCakeAction}
                </Button>
              )}

              <Button
                variant={isFollowing ? 'secondary' : 'outline'}
                size="sm"
                leftIcon={isFollowing ? <Check className="w-3.5 h-3.5" /> : undefined}
                onClick={() => onToggleFollow(bakery.id)}
              >
                {isFollowing ? t.artisans.followingBakery : t.artisans.followBakery}
              </Button>
            </div>
          </div>

          <Divider />

          {/* Bakery Showcase Products */}
          {bakeryProducts.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-display text-lg font-semibold text-[var(--sm-text-primary)]">
                {t.artisans.brandMenuTitle}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bakeryProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-[12px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] p-2.5"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                      className="h-16 w-20 rounded-[8px] overflow-hidden shrink-0 cursor-pointer"
                    >
                      <img
                        src={PRODUCT_MEDIA_MAP[product.mediaKey]}
                        alt={product.title[locale]}
                        className="h-full w-full object-cover"
                      />
                    </button>

                    <div className="min-w-0 flex-1 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectProduct(product);
                        }}
                        className="text-left text-xs font-semibold text-[var(--sm-text-primary)] hover:text-[var(--sm-accent-primary)] line-clamp-1 cursor-pointer"
                      >
                        {product.title[locale]}
                      </button>
                      <p className="font-mono text-xs tabular-nums text-[var(--sm-accent-primary)]">
                        {formatUzsPrice(product.priceUzs)} {t.common.currencyUzs}
                      </p>
                      <button
                        type="button"
                        onClick={() => onQuickAdd(product)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--sm-text-secondary)] hover:text-[var(--sm-accent-primary)] cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" aria-hidden="true" />
                        <span>{t.productCard.quickAdd}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <Divider />

          {/* Reviews List & Submission Form */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 space-y-3">
              <h3 className="font-display text-lg font-semibold text-[var(--sm-text-primary)]">
                {t.artisans.reviewsTitle}
              </h3>

              {isLoadingReviews ? (
                <div className="space-y-2.5" aria-busy="true">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-[12px] bg-[var(--sm-bg-subtle)] animate-pulse"
                    />
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-sm text-[var(--sm-text-muted)]">
                  {t.artisans.noReviewsYet}
                </p>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {reviews.map((rev) => (
                    <article
                      key={rev.id}
                      className="rounded-[12px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[var(--sm-text-primary)]">
                          {rev.authorName}
                        </span>
                        <div className="flex items-center gap-0.5 text-[var(--sm-accent-gold)]">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <Star
                              key={idx}
                              className="w-3 h-3"
                              fill="currentColor"
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--sm-text-secondary)]">
                        {rev.comment}
                      </p>
                      <p className="text-[10px] text-[var(--sm-text-muted)] tabular-nums">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-5">
              <form
                onSubmit={handleReviewSubmit}
                className="rounded-[14px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] p-4 space-y-3.5"
              >
                <h4 className="font-sans text-sm font-semibold text-[var(--sm-text-primary)]">
                  {t.artisans.writeReviewTitle}
                </h4>

                <TextInput
                  label={t.artisans.reviewerNameLabel}
                  placeholder={t.artisans.reviewerNamePlaceholder}
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  maxLength={60}
                  required
                />

                <div className="space-y-1.5">
                  <span className="block text-xs font-medium text-[var(--sm-text-primary)]">
                    {t.artisans.ratingLabel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        aria-label={`${starVal} / 5`}
                        aria-pressed={rating === starVal}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-[7px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-subtle)] cursor-pointer"
                      >
                        <Star
                          className="w-4 h-4 text-[var(--sm-accent-gold)]"
                          fill={starVal <= rating ? 'currentColor' : 'none'}
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <TextArea
                  label={t.artisans.reviewCommentLabel}
                  placeholder={t.artisans.reviewCommentPlaceholder}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={300}
                  rows={3}
                  required
                />

                {formError && (
                  <p role="alert" className="text-xs font-medium text-[var(--sm-status-danger)]">
                    {formError}
                  </p>
                )}

                {submittedNotice && (
                  <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--sm-status-success)]">
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.artisans.reviewSubmittedNote}</span>
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  fullWidth
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? t.artisans.submittingReview : t.artisans.submitReviewButton}
                </Button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
