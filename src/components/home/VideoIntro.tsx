'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

type Cell =
  | { type: 'image'; src: string }
  | { type: 'video'; src: string }
  | { type: 'splash' }

const gridCells: Cell[] = [
  { type: 'image', src: '/portfolio/home/tile-01.jpg' },
  { type: 'video', src: '/portfolio/home/tile-03.mp4' },
  { type: 'image', src: '/portfolio/home/tile-04.jpg' },
  { type: 'image', src: '/portfolio/home/tile-02.jpg' },
  { type: 'splash' },
  { type: 'image', src: '/portfolio/home/tile-06.jpg' },
  { type: 'image', src: '/portfolio/home/tile-07.jpg' },
  { type: 'video', src: '/portfolio/home/tile-05.mp4' },
  { type: 'image', src: '/portfolio/home/tile-08.jpg' },
]

const REVEAL_PHRASE = "Premium creative for Utah's most ambitious brands."

export default function VideoIntro() {
  const sectionRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const revealCenterRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fadeOverlayRef = useRef<HTMLDivElement>(null)
  const phraseRef = useRef<HTMLParagraphElement>(null)
  const charsRef = useRef<HTMLSpanElement[]>([])
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const video = videoRef.current
    const overlay = fadeOverlayRef.current
    if (!video || !overlay) return

    const FADE_BEFORE_END = 0.4
    let rafId: number | null = null
    let isCleanedUp = false
    let isRestarting = false

    video.play().catch(() => {})

    const tick = () => {
      if (isCleanedUp) return

      const duration = video.duration
      if (duration && !isNaN(duration) && !isRestarting) {
        const timeLeft = duration - video.currentTime

        if (timeLeft <= FADE_BEFORE_END && timeLeft > 0) {
          const fadeProgress = 1 - timeLeft / FADE_BEFORE_END
          overlay.style.opacity = String(fadeProgress * 0.85)
        }

        if (timeLeft <= 0.05 && !isRestarting) {
          isRestarting = true
          video.currentTime = 0
          video.play().catch(() => {})

          const fadeOutStart = performance.now()
          const fadeOutDuration = 400
          const fadeOut = (now: number) => {
            if (isCleanedUp) return
            const elapsed = now - fadeOutStart
            const t = Math.min(elapsed / fadeOutDuration, 1)
            overlay.style.opacity = String((1 - t) * 0.85)
            if (t < 1) {
              requestAnimationFrame(fadeOut)
            } else {
              isRestarting = false
            }
          }
          requestAnimationFrame(fadeOut)
        }
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      isCleanedUp = true
      if (rafId) cancelAnimationFrame(rafId)
      video.pause()
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current
      const revealCenter = revealCenterRef.current
      const gallery = galleryRef.current
      const cta = ctaRef.current
      const section = sectionRef.current
      const chars = charsRef.current.filter(Boolean)
      if (!panel || !revealCenter || !gallery || !section) return

      gsap.set(revealCenter, { scale: 0 })
      gsap.set(chars, { opacity: 0, filter: 'blur(10px)', y: 10 })
      if (cta) gsap.set(cta, { opacity: 0, y: 20 })

      gallery.style.gridTemplateColumns = '0fr 1fr 0fr'
      gallery.style.gridTemplateRows = '0fr 1fr 0fr'
      gallery.style.gap = '0px'
      gallery.style.padding = '0px'

      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: false,
        onToggle: (self) => {
          panel.style.display = self.isActive ? 'block' : 'none'
        },
        onUpdate: (self) => {
          const progress = self.progress

          const PHASE_REVEAL_END = 0.3
          const PHASE_HOLD_END = 0.45

          if (progress <= PHASE_REVEAL_END) {
            const p1 = progress / PHASE_REVEAL_END
            const eased = 1 - Math.pow(1 - p1, 3)

            revealCenter.style.transform = `scale(${eased})`

            gallery.style.gridTemplateColumns = '0fr 1fr 0fr'
            gallery.style.gridTemplateRows = '0fr 1fr 0fr'
            gallery.style.gap = '0px'
            gallery.style.padding = '0px'

            chars.forEach((char, i) => {
              if (!char) return
              const charDelay = i * 0.015
              const charStart = 0.5 + charDelay
              const charProgress = Math.max(0, Math.min(1, (p1 - charStart) / 0.3))
              const blur = (1 - charProgress) * 10
              char.style.opacity = String(charProgress)
              char.style.filter = `blur(${blur}px)`
              char.style.transform = `translateY(${(1 - charProgress) * 10}px)`
            })

            if (cta) {
              cta.style.opacity = '0'
              cta.style.transform = 'translateY(20px)'
            }
          } else if (progress <= PHASE_HOLD_END) {
            revealCenter.style.transform = 'scale(1)'

            chars.forEach((char) => {
              if (!char) return
              char.style.opacity = '1'
              char.style.filter = 'blur(0px)'
              char.style.transform = 'translateY(0px)'
            })

            const hold = (progress - PHASE_REVEAL_END) / (PHASE_HOLD_END - PHASE_REVEAL_END)
            if (cta) {
              cta.style.opacity = String(hold)
              cta.style.transform = `translateY(${(1 - hold) * 20}px)`
            }

            gallery.style.gridTemplateColumns = '0fr 1fr 0fr'
            gallery.style.gridTemplateRows = '0fr 1fr 0fr'
            gallery.style.gap = '0px'
            gallery.style.padding = '0px'
          } else {
            const p3 = (progress - PHASE_HOLD_END) / (1 - PHASE_HOLD_END)
            const eased = 1 - Math.pow(1 - p3, 3)

            revealCenter.style.transform = 'scale(1)'

            chars.forEach((char) => {
              if (!char) return
              char.style.opacity = String(Math.max(0, 1 - p3 * 2))
            })
            if (cta) cta.style.opacity = String(Math.max(0, 1 - p3 * 2))

            const sideRatio = eased
            gallery.style.gridTemplateColumns = `${sideRatio}fr 1fr ${sideRatio}fr`
            gallery.style.gridTemplateRows = `${sideRatio}fr 1fr ${sideRatio}fr`
            gallery.style.gap = `${eased * 12}px`
            gallery.style.padding = `${eased * 16}px`

            tileRefs.current.forEach((tile, i) => {
              if (!tile) return
              if (i === 4) return
              const tileDelay = (i < 4 ? i : i - 1) * 0.04
              const tileProgress = Math.max(0, Math.min(1, (eased - tileDelay) / 0.5))
              tile.style.opacity = String(tileProgress)
            })
          }
        },
      })

      panel.style.display = 'none'
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <section
        ref={sectionRef}
        style={{
          position: 'relative',
          height: '400vh',
          width: '100%',
          background: 'transparent',
        }}
      />

      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 41,
          background: 'transparent',
          pointerEvents: 'none',
          display: 'none',
        }}
      >
        <div
          ref={galleryRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: '0fr 1fr 0fr',
            gridTemplateRows: '0fr 1fr 0fr',
            gap: '0px',
            padding: '0px',
            willChange: 'grid-template-columns, grid-template-rows, gap, padding',
          }}
        >
          {gridCells.map((cell, i) => (
            <div
              key={i}
              ref={(el) => {
                tileRefs.current[i] = el
              }}
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'transparent',
                opacity: cell.type === 'splash' ? 1 : 0,
                willChange: 'opacity',
                minWidth: 0,
                minHeight: 0,
              }}
            >
              {cell.type === 'splash' && (
                <div
                  ref={revealCenterRef}
                  className="h-full w-full"
                  style={{ transformOrigin: 'center center' }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  >
                    <source src="/videos/bigbg.mp4" type="video/mp4" />
                  </video>

                  <div
                    ref={fadeOverlayRef}
                    className="pointer-events-none absolute inset-0"
                    style={{
                      opacity: 0,
                      background: '#000',
                    }}
                  />

                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.5) 100%)',
                    }}
                  />
                </div>
              )}

              {cell.type === 'video' && (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                >
                  <source src={cell.src} type="video/mp4" />
                </video>
              )}

              {cell.type === 'image' && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cell.src}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <p
          ref={phraseRef}
          className="absolute left-1/2 z-[60] -translate-x-1/2 px-6 text-center"
          style={{
            bottom: '15%',
            fontFamily: 'var(--font-body, sans-serif)',
            fontSize: 'clamp(0.85rem, 1.1vw, 1.1rem)',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.95)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            maxWidth: '900px',
            pointerEvents: 'none',
          }}
        >
          {REVEAL_PHRASE.split('').map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) charsRef.current[i] = el
              }}
              style={{
                display: 'inline-block',
                whiteSpace: char === ' ' ? 'pre' : 'normal',
                opacity: 0,
                filter: 'blur(10px)',
                transform: 'translateY(10px)',
              }}
            >
              {char}
            </span>
          ))}
        </p>

        <div className="absolute bottom-[8%] left-1/2 z-[60] -translate-x-1/2">
          <Link
            ref={ctaRef}
            href="/about"
            className="group inline-flex items-center gap-4 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.3em] text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white/20 md:text-[11px]"
            style={{ pointerEvents: 'auto' }}
          >
            About Us
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}