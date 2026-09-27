import { db } from './db';
import { deleteRemoteCapsule, pushCapsule } from './syncService';
import type { Capsule, CapsuleDraft, Mood } from './types';

export type CapsuleUpdate = {
  mood: Mood;
  note: string;
  imageBlob?: Blob;
  imageAlt?: string;
};

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

  async update(id: string, changes: CapsuleUpdate): Promise<void> {
    const capsule = await db.capsules.get(id);
    if (!capsule) throw new Error('Capsule not found.');

    const note = changes.note.trim();
    if (!note) throw new Error('Write one sentence to keep.');

    const hasNewImage = changes.imageBlob !== undefined;
    const updatedAt = new Date().toISOString();
    await db.capsules.update(id, {
      mood: changes.mood,
      note,
      imageBlob: changes.imageBlob ?? capsule.imageBlob,
      imageAlt: changes.imageAlt ?? note,
      // Clearing this makes pushCapsule replace the existing storage object.
      imagePath: hasNewImage ? undefined : capsule.imagePath,
      updatedAt,
      syncStatus: 'local',
      syncError: undefined,
    });

    const updated = await db.capsules.get(id);
    if (updated?.userId) void pushCapsule(updated, updated.userId);
  },

  async remove(capsule: Capsule): Promise<void> {
    await db.capsules.delete(capsule.id);
    if (capsule.userId) void deleteRemoteCapsule(capsule, capsule.userId);
  },

  async retrySync(id: string): Promise<void> {
    const capsule = await db.capsules.get(id);
    if (!capsule?.userId) return;
    await pushCapsule(capsule, capsule.userId);
  },
};
