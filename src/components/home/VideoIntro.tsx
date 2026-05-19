'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function VideoIntro() {
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fadeOverlayRef = useRef<HTMLDivElement>(null)
  const topTextRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  // ── SEAMLESS LOOP ──
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

// ── CIRCLE-GROW REVEAL ──
  useEffect(() => {
    const backdrop = backdropRef.current
    const panel = panelRef.current
    const topText = topTextRef.current
    const cta = ctaRef.current
    if (!backdrop || !panel) return

    backdrop.style.opacity = '0'
    panel.style.clipPath = 'circle(0px at 50% 50%)'

    let contentRevealed = false
    let triggerRef: ScrollTrigger | null = null

    // Wait a tick so Hero's pin spacer is in the DOM and measurable
    const timer = setTimeout(() => {
      const docHeight = document.documentElement.scrollHeight
      const vh = window.innerHeight

      // Reveal happens in the last ~25% of the page scroll
    const start = docHeight - vh * 3  // 3 viewports from the bottom (still inside Hero's pin)
const end = docHeight - vh * 2      // 1 viewport from the bottom

      triggerRef = ScrollTrigger.create({
        trigger: document.body,
        start: `${start}px top`,
        end: `${end}px top`,
        scrub: false,
        markers: true, // ← keep markers ON for now so we can verify
        onUpdate: (self) => {
          const progress = self.progress

          const backdropOpacity = Math.min(progress / 0.3, 1)
          backdrop.style.opacity = String(backdropOpacity)

          const circleProgress = Math.max(0, (progress - 0.2) / 0.8)
          const radius = circleProgress * 150
          panel.style.clipPath = `circle(${radius}vmax at 50% 50%)`

          if (progress > 0.8 && !contentRevealed && topText && cta) {
            contentRevealed = true
            gsap.to([topText, cta], {
              y: 0,
              opacity: 1,
              duration: 1.2,
              stagger: 0.2,
              ease: 'power3.out',
            })
          }
        },
      })

      ScrollTrigger.refresh()
    }, 300)

    if (topText && cta) {
      gsap.set([topText, cta], { y: 30, opacity: 0 })
    }

    return () => {
      clearTimeout(timer)
      if (triggerRef) triggerRef.kill()
    }
  }, [])

  return (
    <>
      {/* No scroll anchor section needed — we use body scroll position directly */}

      {/* ── FIXED BACKDROP ── */}
      <div
        ref={backdropRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9998,
          background: '#000',
          pointerEvents: 'none',
          willChange: 'opacity',
          opacity: 0,
        }}
      />

      {/* ── FIXED VIDEO PANEL ── */}
      <div
        ref={panelRef}
        className="overflow-hidden"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          willChange: 'clip-path',
          background: '#000',
          clipPath: 'circle(0px at 50% 50%)',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
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

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* TOP: tiny centered text */}
        <div
          ref={topTextRef}
          className="absolute left-1/2 top-10 z-10 -translate-x-1/2 text-center md:top-14"
        >
          <p
            className="text-[10px] uppercase tracking-[0.35em] text-white/80 md:text-[11px]"
            style={{ fontFamily: 'var(--font-body, system-ui)', lineHeight: 1.7 }}
          >
            A team of strategists,
            <br />
            designers, and storytellers.
          </p>
        </div>

        {/* BOTTOM: About Us pill */}
        <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 md:bottom-14">
          <Link
            ref={ctaRef}
            href="/about"
            className="group inline-flex items-center gap-4 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.3em] text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white/20 md:text-[11px]"
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