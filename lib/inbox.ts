import { parseImageKeys, requestReference } from './item-request'

type Enquiry = { id: string; name: string; email: string; subject: string; message: string; status: string; createdAt: Date }
type PhotoRequest = { id: string; name: string; phone: string; note: string | null; imageKeys: string; status: string; createdAt: Date }

export type InboxItem =
  | ({ kind: 'enquiry' } & Enquiry)
  | ({ kind: 'photo'; keys: string[]; reference: string } & PhotoRequest)

// One list for the Messages page: customer enquiries and photo requests together, newest first.
export function buildInbox(enquiries: Enquiry[], requests: PhotoRequest[]) {
  const items: InboxItem[] = [
    ...enquiries.map(enquiry => ({ kind: 'enquiry' as const, ...enquiry })),
    ...requests.map(request => ({ kind: 'photo' as const, ...request, keys: parseImageKeys(request.imageKeys), reference: requestReference(request.id) })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  return { items, newCount: items.filter(item => item.status === 'NEW').length }
}
