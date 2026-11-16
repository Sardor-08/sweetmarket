import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, X } from 'lucide-react';
import { PRODUCT_MEDIA_MAP } from '../../assets/productMedia';
import { Button } from '../../design-system/ui';
import { useTranslation } from '../../hooks/useTranslation';
import { reactToStory } from '../../services/api/client';
import { BakeryStory, ShowcaseProduct } from '../../types';
import { formatUzsPrice } from './ProductCard';

export interface StoryViewerModalProps {
  stories: BakeryStory[];
  activeIndex: number | null;
  allProducts: ShowcaseProduct[];
  onChangeIndex: (index: number) => void;
  onClose: () => void;
  onViewProduct: (product: ShowcaseProduct) => void;
  onQuickAdd: (product: ShowcaseProduct) => void;
  onStoryUpdated?: (updatedStory: BakeryStory) => void;
}

const STORY_DURATION_MS = 8500;
const LIKED_STORIES_KEY = 'sweetmarket_liked_stories';
const VOTED_POLLS_KEY = 'sweetmarket_voted_story_polls';

function readStoredMap<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoryViewerModal({
  stories,
  activeIndex,
  allProducts,
  onChangeIndex,
  onClose,
  onViewProduct,
  onQuickAdd,
  onStoryUpdated,
}: StoryViewerModalProps) {
  const { locale, t } = useTranslation();

  const [likedIds, setLikedIds] = useState<string[]>(() =>
    readStoredMap<string[]>(LIKED_STORIES_KEY, []),
  );
  const [votedPolls, setVotedPolls] = useState<Record<string, string>>(() =>
    readStoredMap<Record<string, string>>(VOTED_POLLS_KEY, {}),
  );
  const [isReacting, setIsReacting] = useState(false);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        if (activeIndex + 1 < stories.length) onChangeIndex(activeIndex + 1);
        else onClose();
      }
      if (e.key === 'ArrowLeft' && activeIndex > 0) {
        onChangeIndex(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, stories.length, onChangeIndex, onClose]);

  useEffect(() => {
    if (activeIndex === null) return;
    const timer = window.setTimeout(() => {
      if (activeIndex + 1 < stories.length) {
        onChangeIndex(activeIndex + 1);
      } else {
        onClose();
      }
    }, STORY_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, stories.length, onChangeIndex, onClose, likedIds, votedPolls]);

  if (activeIndex === null) return null;
  const story = stories[activeIndex];
  if (!story) return null;

  const linkedProduct = allProducts.find((p) => p.id === story.featuredProductId);
  const postedLabel =
    story.postedMinutesAgo < 60
      ? `${story.postedMinutesAgo} ${t.catalog.storyMinutesAgo}`
      : `${Math.round(story.postedMinutesAgo / 60)} ${t.catalog.storyHoursAgo}`;

  const isLiked = likedIds.includes(story.id);
  const votedOptionId = votedPolls[story.id];
  const totalVotes = story.poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleToggleLike = async () => {
    if (isReacting) return;
    const nextAction = isLiked ? 'unlike' : 'like';
    const nextLiked = isLiked
      ? likedIds.filter((id) => id !== story.id)
      : [...likedIds, story.id];
    setLikedIds(nextLiked);
    try {
      window.localStorage.setItem(LIKED_STORIES_KEY, JSON.stringify(nextLiked));
    } catch {
      // ignore
    }

    setIsReacting(true);
    try {
      const updated = await reactToStory(story.id, { action: nextAction });
      onStoryUpdated?.(updated);
    } catch {
      // ignore transient error
    } finally {
      setIsReacting(false);
    }
  };

  const handleVote = async (optionId: string) => {
    if (isReacting || votedOptionId) return;
    const nextVoted = { ...votedPolls, [story.id]: optionId };
    setVotedPolls(nextVoted);
    try {
      window.localStorage.setItem(VOTED_POLLS_KEY, JSON.stringify(nextVoted));
    } catch {
      // ignore
    }

    setIsReacting(true);
    try {
      const updated = await reactToStory(story.id, { action: 'vote', optionId });
      onStoryUpdated?.(updated);
    } catch {
      // ignore transient error
    } finally {
      setIsReacting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={story.bakeryName}
    >
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[26px] border border-white/25 bg-[#161311] shadow-2xl aspect-[9/16] max-h-[90vh] flex flex-col justify-between">
        {/* Background Media */}
        <img
          src={PRODUCT_MEDIA_MAP[story.mediaKey]}
          alt={story.bakeryName}
          className="absolute inset-0 h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/15 to-black/85 pointer-events-none" />

        {/* Top Progress Bars & Bakery Header */}
        <div className="relative z-20 p-4 space-y-3">
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${stories.length}, minmax(0, 1fr))` }}
          >
            {stories.map((s, idx) => (
              <div key={s.id} className="h-1 rounded-full bg-white/25 overflow-hidden">
                <div
                  className={[
                    'h-full rounded-full bg-white transition-all duration-300',
                    idx < activeIndex ? 'w-full' : idx === activeIndex ? 'w-full opacity-95' : 'w-0',
                  ].join(' ')}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={PRODUCT_MEDIA_MAP[story.bakeryCoverMediaKey]}
                alt=""
                className="h-9 w-9 rounded-full object-cover border border-white/50 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {story.bakeryName}
                </p>
                <p className="text-[11px] text-white/80 tabular-nums">
                  {story.bakeryDistrict[locale]} · {postedLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleToggleLike}
                aria-pressed={isLiked}
                aria-label={isLiked ? t.catalog.storyLikedLabel : t.catalog.storyLikeLabel}
                className={[
                  'inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold backdrop-blur-md border transition-colors cursor-pointer tabular-nums',
                  isLiked
                    ? 'border-[#f2b8a8] bg-[#b4533c] text-white'
                    : 'border-white/25 bg-black/40 text-white hover:bg-black/60',
                ].join(' ')}
              >
                <Heart className="w-3.5 h-3.5" fill={isLiked ? 'currentColor' : 'none'} aria-hidden="true" />
                <span>{story.likesCount}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label={t.catalog.storyClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white backdrop-blur-md hover:bg-black/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Left/Right Navigation Controls */}
        <div className="relative z-20 flex items-center justify-between px-3">
          <button
            type="button"
            disabled={activeIndex === 0}
            onClick={() => onChangeIndex(Math.max(0, activeIndex - 1))}
            aria-label="Prev"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (activeIndex + 1 < stories.length) onChangeIndex(activeIndex + 1);
              else onClose();
            }}
            aria-label="Next"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Caption, Interactive Poll & Linked Product Glass Card */}
        <div className="relative z-20 p-4 space-y-3">
          <p className="text-sm leading-relaxed text-white">
            {story.caption[locale]}
          </p>

          {/* Interactive Poll Card */}
          <div className="rounded-[16px] border border-white/25 bg-black/45 p-3 backdrop-blur-2xl space-y-2">
            <p className="text-xs font-semibold text-white">
              {story.poll.question[locale]}
            </p>
            <div className="space-y-1.5">
              {story.poll.options.map((opt) => {
                const percent =
                  totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                const isSelected = votedOptionId === opt.id;
                const hasVoted = Boolean(votedOptionId);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={hasVoted || isReacting}
                    onClick={() => handleVote(opt.id)}
                    aria-pressed={isSelected}
                    className={[
                      'relative w-full overflow-hidden rounded-[10px] border px-3 py-2 text-left text-xs transition-colors',
                      hasVoted ? 'cursor-default' : 'cursor-pointer hover:bg-white/15',
                      isSelected
                        ? 'border-[#f2b8a8] bg-white/15 text-white font-semibold'
                        : 'border-white/20 bg-white/10 text-white/95',
                    ].join(' ')}
                  >
                    {hasVoted && (
                      <div
                        className="absolute inset-y-0 left-0 bg-[#b4533c]/55 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <span className="truncate">{opt.label[locale]}</span>
                      {hasVoted && (
                        <span className="font-mono text-[11px] tabular-nums shrink-0 text-white/90">
                          {percent}% · {opt.votes} {t.catalog.storyPollVotesUnit}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {linkedProduct && (
            <div className="rounded-[16px] border border-white/25 bg-black/50 p-3 backdrop-blur-2xl space-y-2.5">
              <div className="flex items-center gap-3">
                <img
                  src={PRODUCT_MEDIA_MAP[linkedProduct.mediaKey]}
                  alt=""
                  className="h-12 w-14 rounded-[10px] object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white line-clamp-1">
                    {linkedProduct.title[locale]}
                  </p>
                  <p className="font-mono text-xs tabular-nums text-[#f2b8a8] mt-0.5">
                    {formatUzsPrice(linkedProduct.priceUzs)} {t.common.currencyUzs}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                  onClick={() => {
                    onQuickAdd(linkedProduct);
                    onClose();
                  }}
                >
                  {t.catalog.storyAddCart}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewProduct(linkedProduct);
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
  );
}
