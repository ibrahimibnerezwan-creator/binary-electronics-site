import { ValidationError } from './commerce'
import { REQUEST_LIMITS, photoUrls } from './item-request'
import { saveItemRequest, type PhotoStorage } from './item-request-service'

// A little room above the photo limit for the form fields and multipart framing.
const MAX_BODY_BYTES = REQUEST_LIMITS.maxTotalBytes + 512 * 1024

export async function handleItemRequest(req: Request, deps: { storage: PhotoStorage; allow: (headers: Headers) => Promise<boolean>; publicDomain?: string }) {
  try {
    if (!(await deps.allow(req.headers))) return Response.json({ error: 'Too many requests from this connection. Please try again in an hour.' }, { status: 429 })
    if (Number(req.headers.get('content-length')) > MAX_BODY_BYTES) return Response.json({ error: 'The photos are too large. Choose smaller photos and try again.' }, { status: 413 })
    const form = await req.formData()
    const files = form.getAll('photo')
    if (files.some(file => !(file instanceof File))) throw new ValidationError('Only photos can be sent.')
    const photos = await Promise.all((files as File[]).map(async file => Buffer.from(await file.arrayBuffer())))
    const result = await saveItemRequest({ requestId: form.get('requestId'), name: form.get('name'), phone: form.get('phone'), note: form.get('note'), website: form.get('website') }, photos, deps.storage)
    return Response.json({ success: true, reference: result.reference, duplicate: result.duplicate, photoUrls: deps.publicDomain ? photoUrls(result.keys, deps.publicDomain) : [] })
  } catch (error) {
    if (error instanceof ValidationError) return Response.json({ error: error.message }, { status: 400 })
    console.error('[item-request] could not save a photo request', error)
    return Response.json({ error: 'We could not save your request. Please try again in a few minutes.' }, { status: 503 })
  }
}
