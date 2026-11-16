import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import heroVividCakeImg from '../../assets/images/hero_vivid_cake_1794679210011.jpg';
import { PRODUCT_MEDIA_MAP } from '../../assets/productMedia';
import { Button } from '../../design-system/ui';
import { useTranslation } from '../../hooks/useTranslation';

export interface HeroCarouselBannerProps {
  onExploreProducts: () => void;
  onOpenBakeries: () => void;
}

interface HeroSlideItem {
  id: string;
  src: string;
}

const HERO_SLIDES: HeroSlideItem[] = [
  { id: 'vivid_cake', src: heroVividCakeImg },
  { id: 'medovik', src: PRODUCT_MEDIA_MAP.medovik },
  { id: 'celebration', src: PRODUCT_MEDIA_MAP.celebration_cake },
  { id: 'macarons', src: PRODUCT_MEDIA_MAP.macarons },
  { id: 'truffles', src: PRODUCT_MEDIA_MAP.truffles },
];

const SLIDE_INTERVAL_MS = 5500;

export function HeroCarouselBanner({
  onExploreProducts,
  onOpenBakeries,
}: HeroCarouselBannerProps) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, shouldReduceMotion]);

  const currentSlide = HERO_SLIDES[activeIndex];
  const slideLabel = t.marketplace.heroSlides[activeIndex] ?? t.marketplace.heroImageAlt;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section
      aria-label={t.marketplace.heroTitle}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden bg-[var(--sm-bg-canvas)] min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)] flex items-end lg:items-center"
    >
      {/* Full-Bleed Animated Natural & Vivid Cake/Patisserie Photography */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={currentSlide.id}
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 1.05 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1.0 }
            }
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{
              opacity: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 6.2, ease: 'easeOut' },
            }}
            className="absolute inset-0"
          >
            <img
              src={currentSlide.src}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center sm:object-[64%_center] saturate-[1.14] contrast-[1.03] brightness-[1.03]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Localized Left Contrast Scrim (keeps the cake on the right bright, colorful & clear) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17120F]/72 via-[#17120F]/38 via-45% to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#17120F]/65 via-[#17120F]/20 to-transparent lg:hidden" />

        {/* Natural Seamless Edge Integration into Site Canvas */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--sm-bg-canvas)] via-[var(--sm-bg-canvas)]/35 to-transparent" />
      </div>

      {/* Foreground Content aligned nicely inside 1440px safe area */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl space-y-5">
          <p className="text-xs font-semibold tracking-wide text-[#F7EFE8] drop-shadow-sm">
            {t.marketplace.heroKicker}
          </p>

          <h1
            className="font-display font-semibold tracking-tight text-[#FAF9F7] drop-shadow-[0_2px_14px_rgba(18,12,10,0.45)]"
            style={{ fontSize: 'clamp(2.35rem, 4.6vw, 3.85rem)', lineHeight: 1.08 }}
          >
            {t.marketplace.heroTitle}
          </h1>

          <p className="max-w-xl text-sm sm:text-base leading-relaxed text-[#F2EAE3] drop-shadow-[0_1px_8px_rgba(18,12,10,0.4)]">
            {t.marketplace.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={onExploreProducts}
            >
              {t.marketplace.heroPrimaryCta}
            </Button>
            <button
              type="button"
              onClick={onOpenBakeries}
              className="inline-flex min-h-[46px] items-center justify-center rounded-[12px] border border-white/35 bg-black/25 px-6 py-3 text-sm font-medium text-[#FAF9F7] backdrop-blur-xl hover:bg-black/40 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t.marketplace.heroSecondaryCta}
            </button>
          </div>
        </div>

        {/* Slide Controls & Current Caption */}
        <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
          <p className="text-xs font-medium text-[#FAF9F7] max-w-[280px] lg:text-right drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)]">
            {slideLabel}
          </p>

          <div className="flex items-center gap-2 rounded-[14px] border border-white/25 bg-[#14110F]/50 p-1.5 backdrop-blur-2xl">
            <button
              type="button"
              onClick={handlePrev}
              aria-label={t.marketplace.heroPrevSlide}
              className="inline-flex items-center justify-center w-9 h-9 rounded-[10px] text-[#FAF9F7] hover:bg-white/15 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            <div
              className="flex items-center gap-1.5 px-2"
              role="tablist"
              aria-label={t.marketplace.heroSlideSelect}
            >
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`${idx + 1} / ${HERO_SLIDES.length}`}
                    onClick={() => setActiveIndex(idx)}
                    className={[
                      'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
                      isActive ? 'w-7 bg-[#FAF9F7]' : 'w-2.5 bg-white/40 hover:bg-white/70',
                    ].join(' ')}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label={t.marketplace.heroNextSlide}
              className="inline-flex items-center justify-center w-9 h-9 rounded-[10px] text-[#FAF9F7] hover:bg-white/15 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
