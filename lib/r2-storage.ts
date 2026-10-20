import { uploadToR2, deleteFromR2 } from './r2'
import type { PhotoStorage } from './item-request-service'

export const r2Storage: PhotoStorage = {
  put: async (key, bytes, contentType) => { await uploadToR2(bytes, key, contentType) },
  remove: deleteFromR2,
}
