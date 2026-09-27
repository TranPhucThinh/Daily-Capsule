import { Circle, Minus, Plus, Sparkles } from 'lucide-react';
import type { Mood } from '../../features/capsules/types';
import type { TranslationKey } from '../../i18n/translations';

interface MoodGlyphProps {
  mood: Mood;
  size?: number;
}

export const MOOD_LABEL_KEYS: Record<Mood, TranslationKey> = {
  heavy: 'mood.heavy',
  still: 'mood.still',
  good: 'mood.good',
  light: 'mood.light',
  alive: 'mood.alive',
};

export function MoodGlyph({ mood, size = 18 }: MoodGlyphProps) {
  if (mood === 'heavy') return <Minus aria-hidden="true" size={size} />;
  if (mood === 'still') return <Circle aria-hidden="true" size={size - 3} />;
  if (mood === 'light') return <Plus aria-hidden="true" size={size} />;
  if (mood === 'alive') return <Sparkles aria-hidden="true" size={size} />;

  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 20 20" width={size}>
      <circle cx="6" cy="8" fill="currentColor" r="1" />
      <circle cx="14" cy="8" fill="currentColor" r="1" />
      <path d="M5.5 11.5c1.2 2 3 3 4.5 3s3.3-1 4.5-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}
