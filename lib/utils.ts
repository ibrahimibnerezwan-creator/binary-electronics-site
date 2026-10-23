import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatPartId(sku?: string | null, id?: string | null): string {
  if (sku && sku.trim()) return sku.trim();
  if (id && id.trim()) return `PID-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
  return 'PID-00000000';
}

