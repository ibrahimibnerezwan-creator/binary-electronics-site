'use client'

import { useState } from 'react'
import { updateOrderStatus } from './actions'

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'RETURNED'] as const

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'border-amber-500/30 text-amber-500 bg-amber-500/10',
  PROCESSING: 'border-blue-500/30 text-blue-500 bg-blue-500/10',
  SHIPPED: 'border-purple-500/30 text-purple-500 bg-purple-500/10',
  DELIVERED: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10',
  RETURNED: 'border-red-500/30 text-red-500 bg-red-500/10',
}

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  async function handleChange(newStatus: string) {
    setSaving(true)
    setStatus(newStatus)
    try {
      const res = await updateOrderStatus(orderId, newStatus)
      if (!res.success) {
        setStatus(currentStatus)
        alert('Failed to update status')
      }
    } catch {
      setStatus(currentStatus)
      alert('Failed to update status')
    } finally {
      setSaving(false)
    }
  }

  const colorClass = STATUS_COLORS[status.toUpperCase()] || STATUS_COLORS.PENDING

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving}
      className={`px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg text-[8px] lg:text-[10px] font-black uppercase tracking-widest border cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500/30 ${colorClass} ${saving ? 'opacity-50' : ''}`}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  )
}
