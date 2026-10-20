import { photoUrls } from '@/lib/item-request'

// Small previews of a customer's photos; each opens the full-size photo in a new tab.
export function PhotoThumbs({ keys, name }: { keys: string[]; name: string }) {
  return <div className="flex flex-wrap gap-3">{photoUrls(keys, process.env.CF_PUBLIC_DOMAIN ?? '').map((url, index) => (
    <a key={url} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Open photo ${index + 1} full size`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={`Photo ${index + 1} from ${name}`} loading="lazy" className="h-28 w-28 rounded-lg object-cover border border-white/10" />
    </a>
  ))}</div>
}
