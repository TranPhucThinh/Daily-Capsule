import { db } from './db';
import { pushCapsule } from './syncService';
import type { Capsule, CapsuleDraft } from './types';

export const capsuleService = {
  getByDate(date: string, userId?: string) {
    return db.capsules.filter((capsule) => capsule.date === date && (!capsule.userId || capsule.userId === userId)).first();
  },

  getAll(userId?: string) {
    return db.capsules.filter((capsule) => !capsule.userId || capsule.userId === userId).toArray()
      .then((capsules) => capsules.sort((a, b) => b.date.localeCompare(a.date)));
  },

  async seal(draft: CapsuleDraft): Promise<Capsule> {
    if (!draft.mood) {
      throw new Error('Choose how today felt before sealing.');
    }

    const now = new Date().toISOString();
    const capsule: Capsule = {
      id: crypto.randomUUID(),
      userId: draft.userId,
      date: draft.date,
      mood: draft.mood,
      note: draft.note.trim(),
      imageBlob: draft.imageBlob,
      imageAlt: draft.imageAlt,
      sealedAt: now,
      updatedAt: now,
      syncStatus: 'local',
    };

    await db.capsules.add(capsule);
    if (capsule.userId) void pushCapsule(capsule, capsule.userId);
    return capsule;
  },
};
