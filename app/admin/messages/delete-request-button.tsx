'use client'
import { useTransition } from 'react'
import { deleteRequest } from './actions'

export function DeleteRequestButton({ id, reference }: { id: string; reference: string }) {
  const [pending, startTransition] = useTransition()
  return <button type="button" disabled={pending} className="p-2 rounded bg-red-700 text-white disabled:opacity-50" onClick={() => {
    if (!confirm(`Delete photo request ${reference}? Its photos are removed too. This cannot be undone.`)) return
    startTransition(async () => {
      const form = new FormData(); form.set('id', id)
      try { await deleteRequest(form) } catch { alert('Could not delete this request. Please try again.') }
    })
  }}>{pending ? 'Deleting…' : 'Delete'}</button>
}
