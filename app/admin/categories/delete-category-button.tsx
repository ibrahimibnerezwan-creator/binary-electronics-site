'use client'

import { useState, useTransition } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteCategory } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'

interface DeleteCategoryButtonProps {
  categoryId: string
  categoryName: string
  productCount: number
}

export function DeleteCategoryButton({ categoryId, categoryName, productCount }: DeleteCategoryButtonProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    const warning = productCount > 0
      ? `"${categoryName}" still has ${productCount} product${productCount === 1 ? '' : 's'} attached. Deleting will leave them uncategorized.\n\nDelete anyway?`
      : `Delete the category "${categoryName}"? This cannot be undone.`

    if (!confirm(warning)) return

    startTransition(async () => {
      setError(null)
      const res = await deleteCategory(categoryId)
      if (res && 'error' in res && res.error) {
        setError(res.error)
        alert(res.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      onClick={handleClick}
      disabled={pending}
      title={error || `Delete ${categoryName}`}
      className="h-10 w-10 rounded-xl glass border-red-500/10 hover:text-red-500 transition-all disabled:opacity-50"
    >
      {pending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </Button>
  )
}
