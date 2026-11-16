export interface ColorTokenSpec {
  id: string;
  cssVar: string;
  lightHex: string;
  darkHex: string;
  role: 'canvas' | 'surface' | 'border' | 'text' | 'accent' | 'semantic';
}

export const LENS_SPEC = {
  opacityPercent: 80,
  blurPx: 18,
  saturationPercent: 140,
} as const;

export const COLOR_TOKENS: ColorTokenSpec[] = [
  {
    id: 'bg-canvas',
    cssVar: '--sm-bg-canvas',
    lightHex: '#F5F2ED',
    darkHex: '#0F0D0C',
    role: 'canvas',
  },
  {
    id: 'bg-surface (80% lens)',
    cssVar: '--sm-bg-surface',
    lightHex: 'rgba(255,255,255,0.80)',
    darkHex: 'rgba(28,24,21,0.80)',
    role: 'surface',
  },
  {
    id: 'bg-subtle (80% lens)',
    cssVar: '--sm-bg-subtle',
    lightHex: 'rgba(243,240,234,0.80)',
    darkHex: 'rgba(40,35,31,0.80)',
    role: 'surface',
  },
  {
    id: 'border-subtle',
    cssVar: '--sm-border-subtle',
    lightHex: 'rgba(160,149,136,0.32)',
    darkHex: 'rgba(255,245,235,0.12)',
    role: 'border',
  },
  {
    id: 'border-strong',
    cssVar: '--sm-border-strong',
    lightHex: 'rgba(128,118,106,0.48)',
    darkHex: 'rgba(255,245,235,0.22)',
    role: 'border',
  },
  {
    id: 'text-primary',
    cssVar: '--sm-text-primary',
    lightHex: '#171412',
    darkHex: '#F4F1ED',
    role: 'text',
  },
  {
    id: 'text-secondary',
    cssVar: '--sm-text-secondary',
    lightHex: '#504944',
    darkHex: '#C2BAB2',
    role: 'text',
  },
  {
    id: 'text-muted',
    cssVar: '--sm-text-muted',
    lightHex: '#78706A',
    darkHex: '#928A83',
    role: 'text',
  },
  {
    id: 'accent-primary',
    cssVar: '--sm-accent-primary',
    lightHex: '#8C3B2B',
    darkHex: '#D47862',
    role: 'accent',
  },
  {
    id: 'accent-gold',
    cssVar: '--sm-accent-gold',
    lightHex: '#8E6C2E',
    darkHex: '#C9A45C',
    role: 'accent',
  },
  {
    id: 'status-success',
    cssVar: '--sm-status-success',
    lightHex: '#1F6E4A',
    darkHex: '#4ADE80',
    role: 'semantic',
  },
  {
    id: 'status-danger',
    cssVar: '--sm-status-danger',
    lightHex: '#B42318',
    darkHex: '#F87171',
    role: 'semantic',
  },
];

export const TYPOGRAPHY_SCALE = [
  {
    id: 'display-hero',
    family: 'Playfair Display',
    size: 'clamp(2.25rem, 4vw, 3.5rem)',
    lineHeight: '1.12',
    weight: '600',
    tracking: '-0.02em',
  },
  {
    id: 'section-heading',
    family: 'Playfair Display',
    size: 'clamp(1.5rem, 2.5vw, 2.125rem)',
    lineHeight: '1.2',
    weight: '600',
    tracking: '-0.015em',
  },
  {
    id: 'card-title',
    family: 'Manrope',
    size: '1rem (16px)',
    lineHeight: '1.4',
    weight: '600',
    tracking: '-0.005em',
  },
  {
    id: 'body-prose',
    family: 'Manrope',
    size: '0.9375rem (15px)',
    lineHeight: '1.6',
    weight: '400',
    tracking: '0em',
  },
  {
    id: 'metadata',
    family: 'Manrope',
    size: '0.75rem (12px)',
    lineHeight: '1.4',
    weight: '500',
    tracking: '0.01em',
  },
  {
    id: 'tabular-data',
    family: 'JetBrains Mono',
    size: '0.875rem (14px)',
    lineHeight: '1.4',
    weight: '500',
    tracking: '0em',
  },
] as const;

export const LAYOUT_TOKENS = {
  maxContainerWidth: '1440px',
  contentMeasure: '1280px',
  headerHeightPx: 64,
  mobileBottomNavHeightPx: 56,
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
  },
  breakpoints: {
    mobile: '< 640px',
    tablet: '640px – 1023px',
    desktop: '>= 1024px',
  },
} as const;
