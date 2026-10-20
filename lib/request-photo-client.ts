const MAX_SIDE = 1600
const MAX_BYTES = 1.2 * 1024 * 1024

// Shrinks a customer's photo in the browser before it is sent: at most 1600 px on the long side, re-encoded as JPEG
// under 1.2 MB. Re-encoding also drops hidden metadata such as the place where the photo was taken.
export async function prepareRequestPhoto(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new Error('Choose a photo (JPEG, PNG or WebP).')
  if (file.size > 40 * 1024 * 1024) throw new Error('This photo is too large. Choose a smaller photo.')
  let bitmap: ImageBitmap
  try { bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }) } catch {
    try { bitmap = await createImageBitmap(file) } catch { throw new Error('This photo could not be read. Try a JPEG or PNG photo.') }
  }
  try {
    let scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    for (let attempt = 0; attempt < 4; attempt++) {
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale))
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Photo processing is unavailable in this browser.')
      context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height) // PNG transparency would turn black in JPEG
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', attempt === 0 ? 0.82 : 0.7))
      if (blob && blob.size <= MAX_BYTES) return blob
      scale *= 0.75
    }
  } finally { bitmap.close() }
  throw new Error('This photo is too large. Choose a smaller photo or a screenshot.')
}
