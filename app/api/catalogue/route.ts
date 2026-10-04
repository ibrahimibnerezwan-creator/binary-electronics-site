import { getAllProducts } from '@/lib/data'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function GET() {
  try { return NextResponse.json({ products: await getAllProducts() }, { headers: { 'Cache-Control': 'no-store' } }) }
  catch { return NextResponse.json({ error: 'Catalogue unavailable. Please try again.' }, { status: 503 }) }
}
