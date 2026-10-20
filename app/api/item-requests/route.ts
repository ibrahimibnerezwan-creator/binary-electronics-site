import { handleItemRequest } from '@/lib/item-request-api'
import { r2Storage } from '@/lib/r2-storage'
import { allowRequest } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

// Public on purpose: customers send a photo of a part the store does not list. Many mobile users share one address, so the limit is generous.
export const POST = (req: Request) => handleItemRequest(req, { storage: r2Storage, allow: headers => allowRequest(headers, 'item-request', 10, 60), publicDomain: process.env.CF_PUBLIC_DOMAIN })
