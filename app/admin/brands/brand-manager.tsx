'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrand, deleteBrand } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export function BrandManager({ brands }: { brands: { id: string; name: string; productCount: number }[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true); setError(''); setMessage('')
    try {
      const result = await createBrand(name)
      if (!result.success) { setError(result.error); return }
      setMessage(result.created ? `Brand added: ${result.brand.name}` : `${result.brand.name} already exists. You can select it when adding a product.`)
      setName(''); router.refresh()
    } catch { setError('Could not save the brand. Please retry.') }
    finally { setPending(false) }
  }

  async function remove(id: string, brandName: string) {
    if (pending || !window.confirm(`Delete the unused brand “${brandName}”?`)) return
    setPending(true); setError(''); setMessage('')
    try {
      const result = await deleteBrand(id)
      if (!result.success) { setError(result.error); return }
      setMessage(`Brand deleted: ${brandName}`); router.refresh()
    } catch { setError('Could not delete the brand. Please retry.') }
    finally { setPending(false) }
  }

  return (
    <>
      <Card className="p-5 lg:p-8">
        <form onSubmit={add} className="flex flex-col gap-3">
          <label htmlFor="new-brand-name" className="text-sm font-bold">New brand name</label>
          <Input id="new-brand-name" required maxLength={150} value={name} onChange={event => setName(event.target.value)} disabled={pending} placeholder="e.g. Mean Well" />
          <Button type="submit" disabled={pending || !name.trim()} className="self-start">{pending ? 'Please wait…' : 'Add brand'}</Button>
        </form>
      </Card>
      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">{error}</p>}
      {message && <p role="status" className="text-sm text-gold-500">{message}</p>}
      <Card className="p-5 lg:p-8">
        <h2 className="mb-4 font-bold">Saved brands ({brands.length})</h2>
        {!brands.length ? <p className="text-sm text-text-secondary">No brands yet. Add your first brand above.</p> : (
          <ul className="divide-y divide-primary-500/10">
            {brands.map(brand => (
              <li key={brand.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="min-w-0 flex-1 basis-40">
                  <p className="font-bold break-words">{brand.name}</p>
                  <p className="text-xs text-text-secondary">{brand.productCount} {brand.productCount === 1 ? 'product' : 'products'}</p>
                </div>
                <Button type="button" size="sm" variant="secondary" disabled={pending || brand.productCount > 0} aria-label={`Delete ${brand.name}`} onClick={() => void remove(brand.id, brand.name)}>Delete</Button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs text-text-secondary">Brands used by products cannot be deleted.</p>
      </Card>
    </>
  )
}
