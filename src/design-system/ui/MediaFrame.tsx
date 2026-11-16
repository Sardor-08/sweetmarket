import React, { useState } from 'react';
import { CakeSlice } from 'lucide-react';

export interface MediaFrameProps {
  src: string;
  alt: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '9/16';
  className?: string;
  imgClassName?: string;
}

const ASPECT_CLASSES: Record<NonNullable<MediaFrameProps['aspectRatio']>, string> = {
  '16/9': 'aspect-[16/9]',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '9/16': 'aspect-[9/16]',
};

export function MediaFrame({
  src,
  alt,
  aspectRatio = '4/3',
  className = '',
  imgClassName = '',
}: MediaFrameProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={[
        'relative overflow-hidden bg-[var(--sm-bg-subtle)]',
        ASPECT_CLASSES[aspectRatio],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {hasError ? (
        <div
          role="img"
          aria-label={alt}
          className="w-full h-full flex flex-col items-center justify-center gap-2 p-6 text-center text-[var(--sm-text-muted)]"
        >
          <CakeSlice className="w-7 h-7 opacity-60" aria-hidden="true" />
          <span className="text-xs max-w-[22ch] leading-snug">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setHasError(true)}
          className={['w-full h-full object-cover block', imgClassName]
            .filter(Boolean)
            .join(' ')}
        />
      )}
    </div>
  );
}
