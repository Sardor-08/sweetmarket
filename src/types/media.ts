import { LocalizedText } from './common';

export enum MediaFormat {
  STORY = 'story',
  REEL = 'reel',
}

export interface StoryOrReel {
  id: string;
  companyId: string;
  format: MediaFormat;
  mediaUrl: string;
  thumbnailUrl: string;
  caption: LocalizedText;
  linkedProductId: string | null;
  durationSeconds: number;
  expiresAt: string | null;
  createdAt: string;
}
