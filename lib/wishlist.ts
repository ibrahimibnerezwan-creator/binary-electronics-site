'use client'
import { useMemo, useSyncExternalStore } from 'react'
function subscribe(listener: () => void) {
  window.addEventListener('storage', listener)
  window.addEventListener('wishlist-change', listener)
  return () => { window.removeEventListener('storage', listener); window.removeEventListener('wishlist-change', listener) }
}
function snapshot() { try { return localStorage.getItem('binary_wishlist') || '[]' } catch { return '[]' } }
export function useWishlist(): string[] {
  const value = useSyncExternalStore(subscribe, snapshot, () => '[]')
  return useMemo(() => { try { const ids: unknown = JSON.parse(value); return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : [] } catch { return [] } }, [value])
}
export function writeWishlist(ids: string[]) {
  localStorage.setItem('binary_wishlist', JSON.stringify(ids))
  window.dispatchEvent(new Event('wishlist-change'))
}
