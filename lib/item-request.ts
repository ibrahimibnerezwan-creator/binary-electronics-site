import { ValidationError, normalizePhone, text } from './commerce'

export const REQUEST_LIMITS = { maxPhotos: 3, maxPhotoBytes: 2 * 1024 * 1024, maxTotalBytes: 4 * 1024 * 1024 } as const

export type ImageKind = { ext: 'jpg' | 'png' | 'webp'; type: 'image/jpeg' | 'image/png' | 'image/webp' }

// The type comes from the file's first bytes; its name and declared type are never trusted.
export function detectImageType(bytes: Uint8Array): ImageKind | null {
  const head = Buffer.from(bytes.buffer, bytes.byteOffset, Math.min(bytes.length, 12))
  if (head.length >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return { ext: 'jpg', type: 'image/jpeg' }
  if (head.length >= 8 && head.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: 'png', type: 'image/png' }
  if (head.length >= 12 && head.toString('ascii', 0, 4) === 'RIFF' && head.toString('ascii', 8, 12) === 'WEBP') return { ext: 'webp', type: 'image/webp' }
  return null
}

export function validateItemRequestFields(raw: { requestId?: unknown; name?: unknown; phone?: unknown; note?: unknown; website?: unknown }) {
  if (raw.website) throw new ValidationError('Invalid submission.')
  if (typeof raw.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(raw.requestId)) throw new ValidationError('Please reload the page and try again.')
  return {
    id: raw.requestId,
    name: text(raw.name, 'name', 100),
    phone: normalizePhone(raw.phone),
    note: text(raw.note ?? '', 'note', 1000, false) || null,
  }
}

export const requestReference = (id: string) => `REQ-${id.slice(0, 8).toUpperCase()}`

export function parseImageKeys(json: string): string[] {
  try {
    const keys: unknown = JSON.parse(json)
    return Array.isArray(keys) ? keys.filter((key): key is string => typeof key === 'string') : []
  } catch { return [] }
}

export const photoUrls = (keys: string[], domain: string) => keys.map(key => `${domain.replace(/\/$/, '')}/${key}`)
