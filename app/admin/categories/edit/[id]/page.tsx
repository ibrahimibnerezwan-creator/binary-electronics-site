export const dynamic = 'force-dynamic'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { categories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { CategoryForm } from '../../category-form'
export default async function EditCategoryPage({params}:{params:Promise<{id:string}>}) {
  await requireAdmin()
  const {id}=await params
  const category=await db.query.categories.findFirst({where:eq(categories.id,id)})
  if(!category)notFound()
  return <CategoryForm initial={category}/>
}
