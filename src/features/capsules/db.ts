import Dexie, { type EntityTable } from 'dexie';
import type { Capsule } from './types';

class DailyCapsuleDatabase extends Dexie {
  capsules!: EntityTable<Capsule, 'id'>;

  constructor() {
    super('daily-capsule');

    this.version(1).stores({
      capsules: '&id, &date, sealedAt, updatedAt, syncStatus',
    });

    this.version(2).stores({
      capsules: '&id, date, userId, [userId+date], sealedAt, updatedAt, syncStatus',
    });
  }
}

export const db = new DailyCapsuleDatabase();
