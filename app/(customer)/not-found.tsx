import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 text-center min-h-[60vh]">
      <p className="text-primary-500 font-bold tracking-[0.22em] text-xs uppercase mb-4">
        Page Not Found
      </p>
      <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6">404</h1>
      <p className="text-text-secondary text-lg mb-10 max-w-md">
        This page doesn't exist or the product may have been removed.
      </p>
      <Button asChild size="lg" className="rounded-full bg-primary-500 hover:bg-primary-600 text-black px-12 font-semibold">
        <Link href="/category/computing">
          BROWSE PRODUCTS
        </Link>
      </Button>
    </div>
  )
}
