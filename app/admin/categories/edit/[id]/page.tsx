import { db } from '@/db'
import { categories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { CategoryForm } from '../../category-form'
export default async function EditCategoryPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params
  const category=await db.query.categories.findFirst({where:eq(categories.id,id)})
  if(!category)notFound()
  return <CategoryForm initial={category}/>
}
