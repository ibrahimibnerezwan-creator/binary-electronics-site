'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Placeholder images for electronics
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000&auto=format&fit=crop",
    title: "ELEVATE\nYOUR VISION",
    subtitle: "Experience the next generation of premium electronics. From high-end computing to immersive audio."
  },
  {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000&auto=format&fit=crop",
    title: "NEXT GEN\nGAMING",
    subtitle: "Push your limits with cutting edge hardware built for ultimate performance."
  },
  {
    image: "https://images.unsplash.com/photo-1628233348123-289569cead72?q=80&w=2000&auto=format&fit=crop",
    title: "IMMERSIVE\nAUDIO",
    subtitle: "Hear every detail with high-fidelity sound systems and premium wearables."
  }
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const navigate = useCallback((dir: number) => {
    setDirection(dir)
    setCurrentSlide((prev) => {
      const next = prev + dir
      if (next < 0) return heroSlides.length - 1
      if (next >= heroSlides.length) return 0
      return next
    })
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const timer = setInterval(() => navigate(1), 6000)
    return () => clearInterval(timer)
  }, [reducedMotion, navigate])

  const activeContent = heroSlides[currentSlide]

  // Framer Motion variants
  const imageVariants: Variants = {
    enter: (dir: number) => ({
      clipPath: dir > 0
        ? 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'
        : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
      scale: 1.1,
    }),
    center: {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      scale: 1,
      transition: {
        clipPath: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 8, ease: 'linear' },
      },
    },
    exit: (dir: number) => ({
      clipPath: dir > 0
        ? 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
        : 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
      transition: {
        clipPath: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      },
    }),
  }

  const textContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } },
    exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  }

  const textLineVariants: Variants = {
    hidden: { y: 100, opacity: 0, skewY: 4 },
    visible: { y: 0, opacity: 1, skewY: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { y: -60, opacity: 0, transition: { duration: 0.4, ease: [0.55, 0, 1, 0.45] } },
  }

  const subtitleVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.7 } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.3 } },
  }

  const ctaVariants: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.9 } },
    exit: { y: -15, opacity: 0, transition: { duration: 0.2 } },
  }

  const titleLines = activeContent.title.split('\n')

  return (
    <section className="relative h-screen flex items-end overflow-hidden bg-bg-void">
      {/* Background Images */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={reducedMotion ? undefined : imageVariants}
          initial={reducedMotion ? undefined : "enter"}
          animate="center"
          exit={reducedMotion ? undefined : "exit"}
          className="absolute inset-0"
        >
          <Image
            src={activeContent.image}
            alt={titleLines.join(' ')}
            fill
            className="object-cover"
            priority={currentSlide === 0}
            sizes="100vw"
            quality={85}
          />
          {/* Overlays for dark theme readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-void via-bg-void/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-void/80 via-bg-void/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-16 pb-28 md:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={textContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-4xl"
          >
            {/* Kicker */}
            <motion.span
              variants={subtitleVariants}
              className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full text-[10px] font-black tracking-[0.35em] uppercase mb-6 glass text-primary-400 border-primary-500/20"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
              New arrivals available
            </motion.span>

            {/* Title */}
            <div className="overflow-hidden">
              {titleLines.map((line, i) => (
                <motion.h1
                  key={`${currentSlide}-${i}`}
                  variants={textLineVariants}
                  className="font-display font-black text-white leading-[0.95] tracking-tight text-5xl md:text-7xl lg:text-8xl"
                >
                  {i === titleLines.length - 1 ? <span className="text-gradient">{line}</span> : line}
                </motion.h1>
              ))}
            </div>

            {/* Subtitle */}
            <motion.p
              variants={subtitleVariants}
              className="mt-6 text-text-secondary max-w-lg leading-relaxed text-lg"
            >
              {activeContent.subtitle}
            </motion.p>

            {/* CTA */}
            <motion.div variants={ctaVariants} className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary-500 px-8 text-sm font-bold uppercase text-black hover:bg-primary-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,100,0,0.3)]"
              >
                Explore Store
              </a>
              <a
                href="/categories"
                className="inline-flex h-12 items-center justify-center rounded-full border border-primary-500/30 px-8 text-sm font-bold uppercase text-white hover:bg-primary-500/10 transition-colors glass"
              >
                Categories
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute bottom-8 right-6 md:right-16 flex items-center gap-4">
          <span className="text-text-muted text-xs tracking-widest tabular-nums font-bold">
            {String(currentSlide + 1).padStart(2, '0')}
            <span className="mx-1.5 text-text-muted/50">/</span>
            {String(heroSlides.length).padStart(2, '0')}
          </span>
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-text-muted hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => navigate(1)}
            className="p-2 text-text-muted hover:text-white transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-500/10">
          <motion.div
            key={currentSlide}
            className="h-full bg-primary-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 6, ease: 'linear' }}
          />
        </div>
      </div>
    </section>
  )
}
