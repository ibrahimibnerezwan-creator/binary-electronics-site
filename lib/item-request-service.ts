import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { itemRequests } from '@/db/schema'
import { ValidationError } from './commerce'
import { REQUEST_LIMITS, detectImageType, parseImageKeys, requestReference, validateItemRequestFields } from './item-request'

export interface PhotoStorage {
  put(key: string, bytes: Buffer, contentType: string): Promise<void>
  remove(key: string): Promise<void>
}

const removeAll = (storage: PhotoStorage, keys: string[]) => Promise.allSettled(keys.map(key => storage.remove(key)))

export async function saveItemRequest(raw: Parameters<typeof validateItemRequestFields>[0], photos: Buffer[], storage: PhotoStorage) {
  const fields = validateItemRequestFields(raw)
  if (!photos.length) throw new ValidationError('Add at least one photo of the part.')
  if (photos.length > REQUEST_LIMITS.maxPhotos) throw new ValidationError(`You can send up to ${REQUEST_LIMITS.maxPhotos} photos.`)
  if (photos.some(photo => photo.length > REQUEST_LIMITS.maxPhotoBytes)) throw new ValidationError('Each photo must be under 2 MB. Choose a smaller photo.')
  if (photos.reduce((total, photo) => total + photo.length, 0) > REQUEST_LIMITS.maxTotalBytes) throw new ValidationError('These photos are too large together. Remove one or choose smaller photos.')
  const kinds = photos.map(photo => detectImageType(photo))
  if (kinds.some(kind => !kind)) throw new ValidationError('Only JPEG, PNG or WebP photos can be sent.')

  const reference = requestReference(fields.id)
  // A retry of a request that is already saved uploads nothing again.
  const [existing] = await db.select({ imageKeys: itemRequests.imageKeys }).from(itemRequests).where(eq(itemRequests.id, fields.id)).limit(1)
  if (existing) return { id: fields.id, reference, duplicate: true, keys: parseImageKeys(existing.imageKeys) }

  const keys: string[] = []
  try {
    for (const [index, photo] of photos.entries()) {
      const kind = kinds[index]!
      const key = `requests/${crypto.randomUUID()}.${kind.ext}`
      keys.push(key) // recorded before the upload so a half-finished upload is cleaned up too
      await storage.put(key, photo, kind.type)
    }
    const inserted = await db.insert(itemRequests)
      .values({ id: fields.id, name: fields.name, phone: fields.phone, note: fields.note, imageKeys: JSON.stringify(keys), status: 'NEW', createdAt: new Date() })
      .onConflictDoNothing().returning({ id: itemRequests.id })
    if (!inserted.length) {
      await removeAll(storage, keys)
      const [winner] = await db.select({ imageKeys: itemRequests.imageKeys }).from(itemRequests).where(eq(itemRequests.id, fields.id)).limit(1)
      return { id: fields.id, reference, duplicate: true, keys: parseImageKeys(winner?.imageKeys ?? '[]') }
    }
  } catch (error) {
    await removeAll(storage, keys)
    throw error
  }
  return { id: fields.id, reference, duplicate: false, keys }
}

export async function deleteItemRequest(id: string, storage: PhotoStorage) {
  const [row] = await db.select().from(itemRequests).where(eq(itemRequests.id, id)).limit(1)
  if (!row) return false
  await db.delete(itemRequests).where(eq(itemRequests.id, id))
  await removeAll(storage, parseImageKeys(row.imageKeys))
  return true
}
