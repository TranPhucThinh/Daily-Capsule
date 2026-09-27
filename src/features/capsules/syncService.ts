import { db } from './db'
import type { Capsule } from './types'
import { supabase } from '../../lib/supabase'

type RemoteCapsule = {
  id: string
  user_id: string
  date: string
  mood: Capsule['mood']
  note: string
  image_path: string | null
  image_alt: string | null
  sealed_at: string
  updated_at: string
}

export async function syncUserCapsules(userId: string) {
  if (!supabase) return

  const localCapsules = await db.capsules.filter((capsule) => !capsule.userId || capsule.userId === userId).toArray()
  for (const capsule of localCapsules) await pushCapsule(capsule, userId)

  const { data, error } = await supabase
    .from('capsules')
    .select('id, user_id, date, mood, note, image_path, image_alt, sealed_at, updated_at')
    .order('date', { ascending: false })

  if (error) throw error
  await Promise.all((data as RemoteCapsule[]).map((capsule) => db.capsules.put({
    id: capsule.id,
    userId: capsule.user_id,
    date: capsule.date,
    mood: capsule.mood,
    note: capsule.note,
    imagePath: capsule.image_path ?? undefined,
    imageAlt: capsule.image_alt ?? undefined,
    sealedAt: capsule.sealed_at,
    updatedAt: capsule.updated_at,
    syncStatus: 'synced',
  })))
}

export async function pushCapsule(capsule: Capsule, userId: string) {
  if (!supabase || (capsule.userId && capsule.userId !== userId)) return

  await db.capsules.update(capsule.id, { syncStatus: 'syncing', syncError: undefined, userId })
  try {
    let imagePath = capsule.imagePath
    if (capsule.imageBlob && !imagePath) {
      imagePath = `${userId}/${capsule.id}.webp`
      const { error: uploadError } = await supabase.storage.from('capsule-images').upload(imagePath, capsule.imageBlob, {
        contentType: capsule.imageBlob.type || 'image/webp',
        upsert: true,
      })
      if (uploadError) throw uploadError
    }

    const { error } = await supabase.from('capsules').upsert({
      id: capsule.id,
      user_id: userId,
      date: capsule.date,
      mood: capsule.mood,
      note: capsule.note,
      image_path: imagePath ?? null,
      image_alt: capsule.imageAlt ?? null,
      sealed_at: capsule.sealedAt,
      updated_at: new Date().toISOString(),
    })
    if (error) throw error

    await db.capsules.update(capsule.id, {
      imagePath,
      syncError: undefined,
      syncStatus: 'synced',
      updatedAt: new Date().toISOString(),
      userId,
    })
  } catch (error) {
    await db.capsules.update(capsule.id, {
      syncError: error instanceof Error ? error.message : 'Sync failed',
      syncStatus: 'error',
      userId,
    })
  }
}
