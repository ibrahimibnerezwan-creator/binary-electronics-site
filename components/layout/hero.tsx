'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { ChevronLeft, ChevronRight, Cpu, Zap, Activity } from 'lucide-react'

// Placeholder images for electronics
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000&auto=format&fit=crop",
    title: "ELEVATE\nYOUR VISION",
    subtitle: "Experience the next generation of premium electronics. From high-end computing to immersive audio.",
    code: "NODE_01 // LINK_ESTABLISHED"
  },
  {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000&auto=format&fit=crop",
    title: "NEXT GEN\nGAMING",
    subtitle: "Push your limits with cutting edge hardware built for ultimate performance.",
    code: "G_PRO // OPTIMIZED_LINK"
  },
  {
    image: "https://images.unsplash.com/photo-1628233348123-289569cead72?q=80&w=2000&auto=format&fit=crop",
    title: "IMMERSIVE\nAUDIO",
    subtitle: "Hear every detail with high-fidelity sound systems and premium wearables.",
    code: "AUDIO_X // HIGH_RES_SYNC"
  }
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1) 
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

  const titleLines = activeContent.title.split('\n')

  return (
    <section className="relative h-screen flex items-end overflow-hidden bg-[#020408] font-mono">
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
            className="object-cover opacity-60"
            priority={currentSlide === 0}
            sizes="100vw"
            quality={85}
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-[#020408]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020408]/90 via-transparent to-transparent" />
          
          {/* Tech Grid Overlay */}
          <div className="absolute inset-0 tech-grid opacity-[0.08] pointer-events-none" />
          
          {/* Scanning Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary-500/30 animate-scan z-20 pointer-events-none shadow-[0_0_15px_rgba(var(--color-primary-500),0.5)]" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Meta-info (Top Right) */}
      <div className="absolute top-28 right-8 z-30 hidden md:flex flex-col items-end gap-1 text-[10px] text-primary-500/40 uppercase tracking-widest font-black">
        <div className="flex items-center gap-2">
          <Activity size={10} className="animate-pulse" /> SYSTEM_OS: v4.2.0-STABLE
        </div>
        <div className="flex items-center gap-2">
          <Cpu size={10} /> CORE_TEMP: 32°C
        </div>
        <div className="mt-4 flex items-center gap-2 text-primary-500/60 bg-primary-500/5 px-2 py-1 border border-primary-500/10 backdrop-blur-sm">
          <Zap size={10} className="fill-current" /> {activeContent.code}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-30 w-full px-6 md:px-16 pb-28 md:pb-20">
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
            <motion.div
              variants={subtitleVariants}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-[1px] w-12 bg-primary-500/50" />
              <span className="text-[11px] font-black tracking-[0.4em] uppercase text-primary-500 italic">
                ESTABLISHING_LINK... OK
              </span>
            </motion.div>

            {/* Title */}
            <div className="overflow-hidden">
              {titleLines.map((line, i) => (
                <motion.h1
                  key={`${currentSlide}-${i}`}
                  variants={textLineVariants}
                  className="font-display font-black text-white leading-[0.85] tracking-tighter text-6xl md:text-8xl lg:text-[10rem] uppercase"
                >
                  {i === titleLines.length - 1 ? <span className="text-gradient decoration-primary-500">{line}</span> : line}
                </motion.h1>
              ))}
            </div>

            {/* Subtitle */}
            <motion.p
              variants={subtitleVariants}
              className="mt-8 text-text-muted/80 max-w-xl leading-relaxed text-sm md:text-base border-l-2 border-primary-500/20 pl-6 backdrop-blur-sm bg-primary-500/5 py-4 rounded-r-lg"
            >
              {activeContent.subtitle}
            </motion.p>

            {/* CTA */}
            <motion.div variants={subtitleVariants} className="mt-12 flex flex-wrap items-center gap-6">
              <a
                href="/products"
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden bg-primary-500 px-10 text-xs font-black uppercase text-black transition-all hover:bg-white"
              >
                <span className="relative z-10 flex items-center gap-3">
                  ACCESS CATALOGUE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </a>
              <a
                href="/categories"
                className="group inline-flex h-14 items-center justify-center border border-primary-500/20 px-10 text-xs font-black uppercase text-white hover:bg-primary-500/10 transition-all backdrop-blur-md"
              >
                BROWSE_CATEGORIES
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Indicators */}
        <div className="absolute bottom-10 left-16 hidden lg:flex items-center gap-8">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentSlide ? 1 : -1);
                setCurrentSlide(i);
              }}
              className="group flex flex-col gap-2"
            >
              <div className="text-[10px] font-black text-primary-500/40 group-hover:text-primary-500 transition-colors tracking-widest">
                0{i + 1}
              </div>
              <div className={`h-[2px] w-12 transition-all duration-500 ${i === currentSlide ? 'bg-primary-500 w-24' : 'bg-primary-500/10'}`} />
            </button>
          ))}
        </div>

        {/* Navigation Arrows (Mobile and Desktop) */}
        <div className="absolute bottom-8 right-6 md:right-16 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-4 border border-primary-500/10 hover:border-primary-500/50 text-primary-500/40 hover:text-primary-500 transition-all bg-primary-500/5 backdrop-blur-md"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => navigate(1)}
            className="p-4 border border-primary-500/10 hover:border-primary-500/50 text-primary-500/40 hover:text-primary-500 transition-all bg-primary-500/5 backdrop-blur-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Bottom Metadata */}
        <div className="absolute bottom-8 left-6 md:left-24 hidden md:flex items-center gap-12 text-[8px] text-primary-500/20 font-black uppercase tracking-[0.5em]">
          <span>Lat: 23.8103° N</span>
          <span>Lon: 90.4125° E</span>
          <span className="text-primary-500/40">Encryption: AES-SHA-256</span>
        </div>
      </div>
    </section>
  )
}

function ArrowRight(props: any) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="square" 
      strokeLinejoin="miter"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
