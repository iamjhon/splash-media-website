'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroTestimonials from './HeroTestimonials'
import ServicesRoulette from './ServicesRoulette'
import FluidSim from './FluidSim'
import GradientBlobBg from './GradientBlobBg'


if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

type Service = {
  number: string
  title: string
  description: string
  href: string
}

const services: Service[] = [
  {
    number: '01',
    title: 'Marketing',
    description:
      'TV, radio, social, Google Ads, and local SEO — campaigns engineered to amplify reach and convert audiences.',
    href: '/services/marketing',
  },
  {
    number: '02',
    title: 'Ad Campaigns',
    description:
      'Comprehensive strategies that elevate your brand and put it in front of the right people at the right moment.',
    href: '/services/ad-campaigns',
  },
  {
    number: '03',
    title: 'Web Design',
    description:
      'Custom websites, maintenance, local SEO, and full-stack engineering — built to perform, designed to convert.',
    href: '/services/web-development',
  },
  {
    number: '04',
    title: 'Print',
    description:
      'Business cards, brochures, direct mail, posters, billboards — tactile brand experiences that leave a mark.',
    href: '/services/print',
  },
]

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


// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function HomeExperience() {
  const sectionRef = useRef<HTMLElement>(null)

  // ─── BACKGROUND LAYERS ───
  const whiteBgRef = useRef<HTMLDivElement>(null)

  // ─── HERO ELEMENTS ───
  const heroSplashRef = useRef<HTMLVideoElement>(null)
  const heroBgRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const beat0Ref = useRef<HTMLDivElement>(null)
  const beat1Ref = useRef<HTMLDivElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)

  // ─── VIDEO INTRO ELEMENTS ───
  const galleryRef = useRef<HTMLDivElement>(null)
  const revealCenterRef = useRef<HTMLDivElement>(null)
  const bentoVideoRef = useRef<HTMLVideoElement>(null)
  const fadeOverlayRef = useRef<HTMLDivElement>(null)
  const phraseCharsRef = useRef<HTMLSpanElement[]>([])
  const aboutCtaRef = useRef<HTMLAnchorElement>(null)
  const aboutHeadingRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])

  // ─── TESTIMONIALS ELEMENTS ───

  // ─── HERO SPLASH VIDEO LOOP ───
  useEffect(() => {
    const video = heroSplashRef.current
    if (!video) return

    // Loop at the earlier of: the video's real end, or an optional cap.
    // Set LOOP_CAP to a number of seconds to loop early; null = full clip.
    const LOOP_CAP: number | null = null

    const handleTimeUpdate = () => {
      const end = LOOP_CAP ?? video.duration
      if (end && video.currentTime >= end - 0.05) {
        video.currentTime = 0
        video.play().catch(() => {})
      }
    }
    const handleEnded = () => {
      video.currentTime = 0
      video.play().catch(() => {})
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.play().catch(() => {})

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  // ─── BENTO VIDEO SEAMLESS LOOP ───
  useEffect(() => {
    const video = bentoVideoRef.current
    const overlay = fadeOverlayRef.current
    if (!video || !overlay) return

    const FADE_BEFORE_END = 0.4
    let rafId: number | null = null
    let cleaned = false
    let restarting = false

    video.play().catch(() => {})

    const tick = () => {
      if (cleaned) return
      const duration = video.duration
      if (duration && !isNaN(duration) && !restarting) {
        const timeLeft = duration - video.currentTime
        if (timeLeft <= FADE_BEFORE_END && timeLeft > 0) {
          overlay.style.opacity = String((1 - timeLeft / FADE_BEFORE_END) * 0.85)
        }
        if (timeLeft <= 0.05 && !restarting) {
          restarting = true
          video.currentTime = 0
          video.play().catch(() => {})
          const start = performance.now()
          const fadeOut = (now: number) => {
            if (cleaned) return
            const t = Math.min((now - start) / 400, 1)
            overlay.style.opacity = String((1 - t) * 0.85)
            if (t < 1) requestAnimationFrame(fadeOut)
            else restarting = false
          }
          requestAnimationFrame(fadeOut)
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cleaned = true
      if (rafId) cancelAnimationFrame(rafId)
      video.pause()
    }
  }, [])

  // ─── INTRO TIMELINE (page load animation) ───
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Label fades/slides up
      tl.fromTo(
        labelRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0.1
      )

      // Masked-video headline fades + scales in
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, scale: 0.94, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        0.1
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // ─── THE BIG PINNED SCROLL STORY ───
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!beat0Ref.current || !beat1Ref.current || !galleryRef.current || !revealCenterRef.current)
        return

      // Initial states
      gsap.set(beat1Ref.current, { yPercent: 100, opacity: 0 })
      gsap.set(revealCenterRef.current, { scale: 0 })
      if (phraseCharsRef.current && phraseCharsRef.current.length) {
        gsap.set(phraseCharsRef.current, { opacity: 0, filter: 'blur(10px)', y: 10 })
      }
      gsap.set(aboutCtaRef.current, { opacity: 0, y: 20 })
      if (aboutHeadingRef.current) {
        aboutHeadingRef.current.style.opacity = '0'
      }
      gsap.set(whiteBgRef.current, { opacity: 0 })

      const gallery = galleryRef.current
      gallery.style.gridTemplateColumns = '0fr 1fr 0fr'
      gallery.style.gridTemplateRows = '0fr 1fr 0fr'
      gallery.style.gap = '0px'
      gallery.style.padding = '0px'

      // Phase boundaries (0 → 1 progress over entire pin)
      // 0.00 - 0.05  Beat 0 (blue intro)
      // 0.05 - 0.10  Beat 0 → Beat 1 (pink + services in)
      // 0.10 - 0.15  Beat 1 hold
      // 0.15 - 0.22  Services slide out + splash fades
      // 0.22 - 0.32  Video scale-grow + char reveal
      // 0.32 - 0.40  Hold + About Us CTA
      // 0.40 - 0.50  Bento expansion
      // 0.50 - 0.55  Bento fades, testimonials header appears, morph to electric blue (Thurl)
      // 0.55 - 0.65  Card 1 visible, morph to magenta (Marlene)
      // 0.65 - 0.75  Card 2 visible, morph to teal (GFCBW)
      // 0.75 - 0.85  Card 3 visible
      // 0.85 - 1.00  Hold for final scroll out

      const lerp = (val: number, a: number, b: number) =>
        Math.max(0, Math.min(1, (val - a) / (b - a)))

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=250%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress

          // ─── WHITE BACKGROUND MORPH (bento phase) ───
          // Morphs in during video intro, then holds (no fade → no blue reveal)
          const whiteIn = lerp(p, 0.24, 0.30)
          if (whiteBgRef.current) {
            whiteBgRef.current.style.opacity = String(whiteIn)
          }

          // ─── HERO PHASE A: Beat 0 → Beat 1 (0.05 → 0.10) ───
          const pA = lerp(p, 0.05, 0.10)
          if (beat0Ref.current) {
            beat0Ref.current.style.transform = `translateY(${-pA * 100}%)`
            beat0Ref.current.style.opacity = String(1 - pA)
          }
          if (beat1Ref.current) {
            beat1Ref.current.style.transform = `translateY(${(1 - pA) * 100}%)`
            beat1Ref.current.style.opacity = String(pA)
          }

          // ─── HERO PHASE B: services slide out + splash fades (0.22 → 0.28) ───
          const pB = lerp(p, 0.22, 0.28)
          if (leftColRef.current) {
            leftColRef.current.style.transform = `translateX(${-pB * 120}%)`
            leftColRef.current.style.opacity = String(1 - pB)
          }
          if (rightColRef.current) {
            rightColRef.current.style.transform = `translateX(${pB * 120}%)`
            rightColRef.current.style.opacity = String(1 - pB)
          }
          if (heroBgRef.current) {
            heroBgRef.current.style.opacity = String(1 - pB)
          }
          if (beat1Ref.current && pB > 0) {
  beat1Ref.current.style.opacity = String(1 - pB)
}

          // ─── VIDEO PHASE C: scale-grow + char reveal (0.28 → 0.38) ───
          const pC = lerp(p, 0.28, 0.38)
          const easedC = 1 - Math.pow(1 - pC, 3)
          if (revealCenterRef.current) {
            revealCenterRef.current.style.transform = `scale(${easedC})`
          }

          phraseCharsRef.current.forEach((char, i) => {
            if (!char) return
            const charDelay = i * 0.003
            const charStart = 0.31 + charDelay
            const charProgress = lerp(p, charStart, charStart + 0.05)
            char.style.opacity = String(charProgress)
            char.style.filter = `blur(${(1 - charProgress) * 10}px)`
            char.style.transform = `translateY(${(1 - charProgress) * 10}px)`
          })

          // ─── VIDEO PHASE D: Hold + CTA fade-in (0.32 → 0.40) ───
          const pD = lerp(p, 0.32, 0.40)
          if (aboutCtaRef.current) {
            aboutCtaRef.current.style.opacity = String(pD)
            aboutCtaRef.current.style.transform = `translateY(${(1 - pD) * 20}px)`
          }
          if (aboutHeadingRef.current) {
            aboutHeadingRef.current.style.opacity = String(pD)
          }

          // ─── VIDEO PHASE E: Bento expansion (0.40 → 0.95) ───
          const pE = lerp(p, 0.40, 0.95)
          const easedE = 1 - Math.pow(1 - pE, 3)

          // Phrase + About CTA fade as bento expands
          phraseCharsRef.current.forEach((char) => {
            if (!char) return
            const baseOpacity = parseFloat(char.style.opacity || '1')
            char.style.opacity = String(baseOpacity * Math.max(0, 1 - pE * 2))
          })
          if (aboutCtaRef.current && pE > 0) {
            const baseOpacity = parseFloat(aboutCtaRef.current.style.opacity || '1')
            aboutCtaRef.current.style.opacity = String(baseOpacity * Math.max(0, 1 - pE * 2))
          }
          if (aboutHeadingRef.current && pE > 0) {
            const baseOpacity = parseFloat(aboutHeadingRef.current.style.opacity || '1')
            aboutHeadingRef.current.style.opacity = String(baseOpacity * Math.max(0, 1 - pE * 2))
          }

          if (galleryRef.current) {
            const sideRatio = easedE
            galleryRef.current.style.gridTemplateColumns = `${sideRatio}fr 1fr ${sideRatio}fr`
            galleryRef.current.style.gridTemplateRows = `${sideRatio}fr 1fr ${sideRatio}fr`
            galleryRef.current.style.gap = `${easedE * 12}px`
            galleryRef.current.style.padding = `${easedE * 16}px`
          }

          tileRefs.current.forEach((tile, i) => {
            if (!tile || i === 4) return
            const tileDelay = (i < 4 ? i : i - 1) * 0.04
            const tileProgress = Math.max(0, Math.min(1, (easedE - tileDelay) / 0.5))
            tile.style.opacity = String(tileProgress)
          })

          // Bento stays fully visible until the pin releases (no empty tail)
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      data-hero
      className="relative h-screen w-full overflow-hidden"
      style={{
        // Base blue gradient — always visible
        background: `
          radial-gradient(circle at 30% 20%, #5eb8f5 0%, transparent 40%),
          radial-gradient(circle at 70% 35%, #1e88e5 0%, transparent 45%),
          radial-gradient(circle at 50% 80%, #2563eb 0%, transparent 50%),
          radial-gradient(circle at 25% 75%, #0ea5e9 0%, transparent 45%),
          linear-gradient(135deg, #0a3a6f 0%, #0e4a85 50%, #082752 100%)
        `,
      }}
    >
      {/* White — background morph for bento phase */}
      <div
        ref={whiteBgRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0,
          zIndex: 4,
          willChange: 'opacity',
          background: '#ffffff',
        }}
      />

      {/* ─── HERO GRADIENT BLOB BACKGROUND ─── */}
      <div ref={heroBgRef} className="absolute inset-0 z-[5]">
        <GradientBlobBg />
      </div>

      <FluidSim />
      {/* ─── BEAT 0 — intro copy ─── */}
      <div ref={beat0Ref} className="absolute inset-0 z-[10]" style={{ pointerEvents: 'none' }}>
        {/* Giant headline + subtitle, vertically centered */}
        <div
          className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-4 text-center md:px-8"
          style={{ pointerEvents: 'auto' }}
        >
          {/* WE ARE SPLASH — video revealed through the letters */}
          <div ref={taglineRef} className="hero-masktext" aria-label="We Are Splash">
            <svg
              viewBox="0 0 1100 200"
              preserveAspectRatio="xMidYMid meet"
              style={{ width: '100%', height: 'auto', display: 'block', filter: 'drop-shadow(0 8px 40px rgba(6,26,54,0.4))' }}
            >
              <defs>
                <mask id="heroTextMask">
                  <rect width="100%" height="100%" fill="black" />
                  <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="white"
                    style={{
                      fontFamily: 'var(--font-gobold, sans-serif)',
                      fontWeight: 700,
                      fontSize: '180px',
                      letterSpacing: '-6px',
                      textTransform: 'uppercase',
                    }}
                  >
                    WE ARE SPLASH
                  </text>
                </mask>
              </defs>

              {/* the video, clipped to the text mask */}
              <foreignObject width="1100" height="200" mask="url(#heroTextMask)">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                  <source src="/videos/bigbg.mp4" type="video/mp4" />
                </video>
              </foreignObject>
            </svg>
          </div>

          {/* PREMIUM MARKETING AGENCY — thin subtitle */}
<p
  ref={labelRef}
  className="mt-8 text-white"
  style={{
    fontFamily: 'var(--font-body, sans-serif)',
    fontSize: 'clamp(1rem, 3vw, 2.2rem)',
    fontWeight: 300,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  }}
>
  Premium Marketing Agency
</p>
<HeroTestimonials /> 
        </div>

       {/* Scroll-down indicator — bottom center */}
<div
  className="absolute bottom-[8%] left-1/2 -translate-x-1/2"
  style={{ pointerEvents: 'none' }}
>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
    <span
      style={{
        fontFamily: 'var(--font-body, sans-serif)',
        fontSize: '0.7rem',
        fontWeight: 400,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.7)',
      }}
    >
      Scroll to explore
    </span>
    <span
      aria-hidden
      style={{
        display: 'block',
        width: '1px',
        height: '48px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)',
        animation: 'scrollLine 2s ease-in-out infinite',
      }}
    />
  </div>
</div>
      </div>

      {/* ─── BEAT 1 — services roulette ─── */}
      <div ref={beat1Ref} className="absolute inset-0 z-[16]" style={{ pointerEvents: 'none' }}>
        <div
          className="relative flex h-full w-full items-center px-6 md:px-12 lg:px-20"
          style={{ pointerEvents: 'auto' }}
        >
          {/* hidden spacer keeps leftColRef valid for scroll animation */}
          <div ref={leftColRef} className="hidden" aria-hidden />

          {/* Services list (has its own "What We Do" header) */}
          <div ref={rightColRef} className="h-full w-full">
            <ServicesRoulette />
          </div>
        </div>
      </div>



      {/* ─── VIDEO INTRO BENTO GRID ─── */}
      <div
        ref={galleryRef}
        className="absolute inset-0 z-[15]"
        style={{
          display: 'grid',
          gridTemplateColumns: '0fr 1fr 0fr',
          gridTemplateRows: '0fr 1fr 0fr',
          gap: '0px',
          padding: '0px',
          pointerEvents: 'none',
          willChange: 'grid-template-columns, grid-template-rows, gap, padding, opacity',
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
              <div ref={revealCenterRef} className="h-full w-full" style={{ transformOrigin: 'center center' }}>
                <video
                  ref={bentoVideoRef}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                >
                  <source src="/videos/bigbg.mp4" type="video/mp4" />
                </video>
                <div ref={fadeOverlayRef} className="pointer-events-none absolute inset-0" style={{ opacity: 0, background: '#000' }} />
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
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              >
                <source src={cell.src} type="video/mp4" />
              </video>
            )}

            {cell.type === 'image' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cell.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            )}
          </div>
        ))}
      </div>

     

      {/* ─── ABOUT US HEADER — grouped at top ─── */}
      <div
        ref={aboutHeadingRef}
        className="pointer-events-none absolute inset-x-0 top-[12%] z-[20] px-6 text-center"
        style={{ opacity: 0 }}
      >
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.4em] text-white/70 md:text-[11px]">
          <span className="mr-3 inline-block h-px w-8 align-middle bg-white/40" />
          About Us
          <span className="ml-3 inline-block h-px w-8 align-middle bg-white/40" />
        </p>
        <h2
          className="mx-auto max-w-4xl text-balance text-white"
          style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: 'clamp(1.6rem, 3.5vw, 3rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
          }}
        >
          A group of talented individuals, driven to tell your story beautifully.
        </h2>
      </div>

      {/* ─── ABOUT US CTA — bottom center ─── */}
      <div className="absolute bottom-[8%] left-1/2 z-[20] -translate-x-1/2" style={{ pointerEvents: 'none' }}>
        <Link
          ref={aboutCtaRef}
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
    </section>
  )
}

// ─────────────────────────────────────────────
// SUB-COMPONENT: SERVICE CARD
// ─────────────────────────────────────────────
function ServiceCard({ service, align }: { service: Service; align: 'left' | 'right' }) {
  const alignClasses = align === 'left' ? 'text-left items-start' : 'text-right items-end'
  const linkAlign = align === 'right' ? 'self-end' : 'self-start'

  return (
    <div className={`relative flex flex-col gap-3 ${alignClasses}`}>
      <span
        aria-hidden
        className="pointer-events-none absolute select-none"
        style={{
          fontFamily: 'var(--font-display, sans-serif)',
          fontSize: 'clamp(5rem, 5vw, 9rem)',
          fontWeight: 700,
          color: 'rgba(255, 255, 255, 0.06)',
          letterSpacing: '-0.04em',
          lineHeight: 0.8,
          top: '-1.5rem',
          [align]: '0',
          zIndex: 0,
        }}
      >
        {service.number}
      </span>

      <span
        className="relative z-10 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-white/60"
        style={{ fontFamily: 'var(--font-narrow, sans-serif)' }}
      >
        {align === 'left' && <span className="inline-block h-px w-6 bg-white/40" />}
        {service.number} — Service
        {align === 'right' && <span className="inline-block h-px w-6 bg-white/40" />}
      </span>

      <h3
        className="relative z-10 leading-[0.9] text-white"
        style={{
          fontFamily: 'var(--font-display, sans-serif)',
          fontSize: 'clamp(2rem, 1vw, 3.5rem)',
          letterSpacing: '-0.02em',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        {service.title}
      </h3>

      <p
        className="relative z-10 text-balance text-sm leading-relaxed text-white/85 md:text-base"
        style={{ fontFamily: 'var(--font-body, system-ui)', maxWidth: '32ch' }}
      >
        {service.description}
      </p>

      <Link
        href={service.href}
        className={`group relative z-10 mt-2 inline-flex items-center gap-3 border-b border-white/30 pb-1 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:border-white ${linkAlign}`}
      >
        Explore
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  )
}