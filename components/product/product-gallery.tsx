'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProductGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0)

  // Fallback if no images
  const displayImages = images.length > 0 ? images : ['https://via.placeholder.com/800x800']

  return (
    <div className="flex flex-col gap-6">
      <div className="relative aspect-square glass border-primary-500/5 rounded-3xl overflow-hidden group cursor-zoom-in">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full bg-bg-void/50"
          >
            <Image
              src={displayImages[active]}
              alt="Product"
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom Icon */}
        <div className="absolute bottom-6 right-6 p-3 rounded-full glass border border-primary-500/10 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={20} />
        </div>

        {/* Arrows */}
        {displayImages.length > 1 && (
          <>
            <button 
              onClick={() => setActive((active - 1 + displayImages.length) % displayImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass border border-primary-500/10 text-primary-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary-500 hover:text-white"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setActive((active + 1) % displayImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass border border-primary-500/10 text-primary-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary-500 hover:text-white"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 lg:grid-cols-6 gap-4">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'relative aspect-square glass rounded-xl overflow-hidden border-2 transition-all p-2',
                active === i ? 'border-primary-500' : 'border-transparent opacity-60 hover:opacity-100'
              )}
            >
              <Image src={img} alt={`Thumb ${i}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
