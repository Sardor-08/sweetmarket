import React from 'react';
import { PRODUCT_MEDIA_MAP } from '../../assets/productMedia';
import { useTranslation } from '../../hooks/useTranslation';
import { BakeryStory } from '../../types';

export interface StoriesStripProps {
  stories: BakeryStory[];
  viewedIds: string[];
  onSelectStory: (index: number) => void;
}

export function StoriesStrip({
  stories,
  viewedIds,
  onSelectStory,
}: StoriesStripProps) {
  const { locale, t } = useTranslation();

  if (stories.length === 0) return null;

  return (
    <section
      aria-label={t.catalog.storiesHeading}
      className="rounded-[22px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-surface)] sm-lens p-4 sm:p-5 space-y-3.5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg sm:text-xl font-semibold text-[var(--sm-text-primary)]">
          {t.catalog.storiesHeading}
        </h2>
        <p className="text-xs text-[var(--sm-text-muted)]">
          {t.catalog.storiesSubheading}
        </p>
      </div>

      <div className="flex items-start gap-4 overflow-x-auto pb-1">
        {stories.map((story, idx) => {
          const isViewed = viewedIds.includes(story.id);
          return (
            <button
              key={story.id}
              type="button"
              onClick={() => onSelectStory(idx)}
              className="group flex w-24 sm:w-28 shrink-0 flex-col items-center gap-2 text-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sm-focus-ring)] rounded-[14px]"
            >
              <div
                className={[
                  'relative h-20 w-20 sm:h-22 sm:w-22 rounded-full p-[3px] transition-transform duration-200 group-hover:scale-[1.03]',
                  isViewed
                    ? 'bg-[var(--sm-border-strong)]'
                    : 'bg-gradient-to-tr from-[var(--sm-accent-primary)] via-[#c98b5b] to-[var(--sm-accent-gold)]',
                ].join(' ')}
              >
                <div className="h-full w-full overflow-hidden rounded-full border-2 border-[var(--sm-bg-canvas)] bg-[var(--sm-bg-subtle)]">
                  <img
                    src={PRODUCT_MEDIA_MAP[story.mediaKey]}
                    alt={story.bakeryName}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="w-full space-y-0.5">
                <p className="text-xs font-semibold text-[var(--sm-text-primary)] truncate">
                  {story.bakeryName}
                </p>
                <p className="text-[10px] text-[var(--sm-text-muted)] truncate">
                  {story.bakeryDistrict[locale]}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
