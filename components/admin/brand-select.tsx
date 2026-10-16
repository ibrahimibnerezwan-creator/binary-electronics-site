'use client'

import { useId, useState } from 'react'
import { createBrand } from '@/app/admin/brands/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Brand { id: string; name: string }

export function BrandSelect({ brands, initialValue = '', onSavingChange }: {
  brands: Brand[]
  initialValue?: string
  onSavingChange: (saving: boolean) => void
}) {
  const id = useId()
  const [value, setValue] = useState(initialValue)
  const [added, setAdded] = useState<Brand[]>([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const options = [...brands, ...added.filter(brand => !brands.some(existing => existing.id === brand.id))]
    .sort((a, b) => a.name.localeCompare(b.name))

  async function saveBrand() {
    if (saving) return
    if (!name.trim()) { setError('Please enter a brand name.'); return }
    setError(''); setMessage(''); setSaving(true); onSavingChange(true)
    try {
      const result = await createBrand(name)
      if (!result.success) { setError(result.error); return }
      setAdded(previous => [...previous.filter(brand => brand.id !== result.brand.id), result.brand])
      setValue(result.brand.id)
      setMessage(`${result.created ? 'Brand added' : 'Existing brand selected'}: ${result.brand.name}`)
      setName(''); setOpen(false)
    } catch {
      setError('Could not save the brand. Your product details are still here. Please retry.')
    } finally {
      setSaving(false); onSavingChange(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Brand</label>
        <button type="button" disabled={saving} onClick={() => { setOpen(!open); setError(''); setMessage('') }} aria-expanded={open} aria-controls={`${id}-create`} className="text-xs font-bold text-primary-500 hover:underline py-2">
          {open ? 'Cancel new brand' : 'Add brand'}
        </button>
      </div>
      <select id={id} name="brandId" value={value} onChange={event => setValue(event.target.value)} className="h-12 lg:h-14 w-full min-w-0 bg-bg-void/40 border border-primary-500/10 rounded-xl lg:rounded-2xl px-4 text-sm focus:outline-none focus:border-primary-500">
        <option value="">No brand</option>
        {options.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
      </select>
      {open && (
        <div id={`${id}-create`} role="group" aria-label="Add a brand" className="space-y-3 rounded-xl border border-primary-500/20 p-3">
          <label htmlFor={`${id}-name`} className="block text-xs">New brand name</label>
          <Input id={`${id}-name`} value={name} maxLength={150} disabled={saving} onChange={event => setName(event.target.value)} placeholder="e.g. Mean Well" onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); void saveBrand() } }} />
          <Button type="button" size="sm" disabled={saving || !name.trim()} onClick={() => void saveBrand()} className="w-full">{saving ? 'Saving brand…' : 'Save brand'}</Button>
          <p className="text-xs text-text-secondary">The new brand will be selected for this product.</p>
        </div>
      )}
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {message && <p role="status" className="text-xs text-gold-500">{message}</p>}
    </div>
  )
}
