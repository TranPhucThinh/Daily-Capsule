export const MOODS = ['heavy', 'still', 'good', 'light', 'alive'] as const;

export type Mood = (typeof MOODS)[number];
export type CapsuleSyncStatus = 'local' | 'syncing' | 'synced' | 'error';

export interface Capsule {
  id: string;
  userId?: string;
  date: string;
  mood: Mood;
  note: string;
  imageBlob?: Blob;
  imagePath?: string;
  imageAlt?: string;
  isKeepsake?: boolean;
  sealedAt: string;
  updatedAt: string;
  syncStatus: CapsuleSyncStatus;
  syncError?: string;
}

export interface CapsuleDraft {
  userId?: string;
  date: string;
  mood?: Mood;
  note: string;
  imageBlob?: Blob;
  imageAlt?: string;
}
