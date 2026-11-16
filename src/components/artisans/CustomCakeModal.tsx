import React, { useEffect, useState } from 'react';
import { CakeSlice, Check, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { PRODUCT_MEDIA_MAP } from '../../assets/productMedia';
import { Button, Divider, TextInput } from '../../design-system/ui';
import { AddCustomCakeInput } from '../../hooks/useCart';
import { useTranslation } from '../../hooks/useTranslation';
import { uz } from '../../i18n/uz';
import { ru } from '../../i18n/ru';
import { BakerySummary } from '../../types';
import { formatUzsPrice } from '../catalog/ProductCard';

export interface CustomCakeModalProps {
  bakery: BakerySummary | null;
  onAddCustomCake: (input: AddCustomCakeInput) => void;
  onOpenCart: () => void;
  onClose: () => void;
}

export function CustomCakeModal({
  bakery,
  onAddCustomCake,
  onOpenCart,
  onClose,
}: CustomCakeModalProps) {
  const { locale, t } = useTranslation();

  const [selectedTierId, setSelectedTierId] = useState<'tier-1500' | 'tier-2500' | 'tier-4000'>('tier-1500');
  const [selectedFillingId, setSelectedFillingId] = useState<
    'vanilla_berry' | 'chocolate_pistachio' | 'honey_saffron' | 'red_velvet_cream'
  >('vanilla_berry');
  const [quantity, setQuantity] = useState(1);
  const [inscription, setInscription] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!bakery) return;
    setSelectedTierId('tier-1500');
    setSelectedFillingId('vanilla_berry');
    setQuantity(1);
    setInscription('');
    setJustAdded(false);
  }, [bakery?.id]);

  useEffect(() => {
    if (!bakery) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [bakery, onClose]);

  if (!bakery) return null;

  const activeTier =
    t.artisans.customCakeTiers.find((tier) => tier.id === selectedTierId) ??
    t.artisans.customCakeTiers[0];
  const activeFilling =
    t.artisans.customCakeFillings.find((f) => f.id === selectedFillingId) ??
    t.artisans.customCakeFillings[0];

  const unitPriceUzs = activeTier.priceUzs + activeFilling.extraPriceUzs;
  const totalPriceUzs = unitPriceUzs * quantity;

  const handleAdd = () => {
    const uzTier =
      uz.artisans.customCakeTiers.find((item) => item.id === activeTier.id) ??
      uz.artisans.customCakeTiers[0];
    const ruTier =
      ru.artisans.customCakeTiers.find((item) => item.id === activeTier.id) ??
      ru.artisans.customCakeTiers[0];

    const uzFilling =
      uz.artisans.customCakeFillings.find((item) => item.id === activeFilling.id) ??
      uz.artisans.customCakeFillings[0];
    const ruFilling =
      ru.artisans.customCakeFillings.find((item) => item.id === activeFilling.id) ??
      ru.artisans.customCakeFillings[0];

    onAddCustomCake({
      bakery,
      tierId: activeTier.id,
      tierLabel: { uz: uzTier.label, ru: ruTier.label },
      weightGrams: activeTier.weightGrams,
      fillingId: activeFilling.id,
      fillingLabel: { uz: uzFilling.label, ru: ruFilling.label },
      unitPriceUzs,
      quantity,
      customNote: inscription,
    });
    setJustAdded(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-cake-title"
    >
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[20px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-elevated)] sm-lens shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--sm-border-subtle)] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <CakeSlice className="w-5 h-5 text-[var(--sm-accent-primary)]" aria-hidden="true" />
            <div>
              <h2
                id="custom-cake-title"
                className="font-display text-xl font-semibold text-[var(--sm-text-primary)]"
              >
                {t.artisans.customCakeTitle}
              </h2>
              <p className="text-xs text-[var(--sm-text-muted)]">
                {bakery.name} · {bakery.district[locale]}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.productCard.closePreview}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-[var(--sm-text-secondary)] hover:bg-[var(--sm-bg-subtle)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4 rounded-[14px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] p-3.5">
            <img
              src={PRODUCT_MEDIA_MAP.celebration_cake}
              alt={t.artisans.customCakeTitle}
              className="h-16 w-20 rounded-[10px] object-cover shrink-0"
            />
            <p className="text-xs sm:text-sm leading-relaxed text-[var(--sm-text-secondary)]">
              {t.artisans.customCakeSubtitle}
            </p>
          </div>

          {/* Step 1: Weight & Tier */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[var(--sm-text-primary)]">
              {t.artisans.selectWeightTier}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {t.artisans.customCakeTiers.map((tier) => {
                const selected = tier.id === selectedTierId;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      setSelectedTierId(tier.id);
                      setJustAdded(false);
                    }}
                    aria-pressed={selected}
                    className={[
                      'rounded-[10px] border p-3 text-left transition-colors cursor-pointer space-y-1',
                      selected
                        ? 'border-[var(--sm-accent-primary)] bg-[var(--sm-accent-primary-soft)] text-[var(--sm-text-primary)]'
                        : 'border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] text-[var(--sm-text-secondary)] hover:border-[var(--sm-border-strong)]',
                    ].join(' ')}
                  >
                    <p className="text-xs font-semibold">{tier.label}</p>
                    <p className="font-mono text-xs tabular-nums text-[var(--sm-accent-primary)]">
                      {formatUzsPrice(tier.priceUzs)} {t.common.currencyUzs}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Filling */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[var(--sm-text-primary)]">
              {t.artisans.selectFilling}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {t.artisans.customCakeFillings.map((filling) => {
                const selected = filling.id === selectedFillingId;
                return (
                  <button
                    key={filling.id}
                    type="button"
                    onClick={() => {
                      setSelectedFillingId(filling.id);
                      setJustAdded(false);
                    }}
                    aria-pressed={selected}
                    className={[
                      'flex items-center justify-between gap-2 rounded-[10px] border px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer',
                      selected
                        ? 'border-[var(--sm-accent-primary)] bg-[var(--sm-accent-primary-soft)] text-[var(--sm-text-primary)] font-semibold'
                        : 'border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] text-[var(--sm-text-secondary)] hover:border-[var(--sm-border-strong)]',
                    ].join(' ')}
                  >
                    <span>{filling.label}</span>
                    <span className="font-mono tabular-nums shrink-0 text-[var(--sm-accent-primary)]">
                      {filling.extraPriceUzs === 0
                        ? t.artisans.customCakeBaseIncluded
                        : `+${formatUzsPrice(filling.extraPriceUzs)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Quantity & Inscription */}
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
                    setQuantity((q) => Math.min(10, q + 1));
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
                label={t.artisans.inscriptionLabel}
                placeholder={t.artisans.inscriptionPlaceholder}
                value={inscription}
                maxLength={160}
                onChange={(e) => {
                  setInscription(e.target.value);
                  setJustAdded(false);
                }}
              />
            </div>
          </div>

          <Divider />

          {justAdded && (
            <div className="flex items-center justify-between gap-3 rounded-[8px] border border-[var(--sm-status-success)]/35 bg-[var(--sm-status-success)]/10 px-3.5 py-2 text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-[var(--sm-status-success)]">
                <Check className="w-3.5 h-3.5" />
                {t.artisans.customCakeAddedNotice}
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

          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<ShoppingBag className="w-4 h-4" />}
            onClick={handleAdd}
          >
            {t.artisans.addCustomCakeButton} · {formatUzsPrice(totalPriceUzs)}{' '}
            {t.common.currencyUzs}
          </Button>
        </div>
      </div>
    </div>
  );
}
