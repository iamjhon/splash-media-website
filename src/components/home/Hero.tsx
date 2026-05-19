'use client'

import { forwardRef, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ── SERVICE DATA ──
type Service = {
  number: string
  title: string
  description: string
  href: string
}

const servicePairs: [Service, Service][] = [
  [
    {
      number: '01',
      title: 'Marketing',
      description:
        'TV, radio, social, Google Ads, and local SEO — campaigns engineered to amplify reach and convert audiences into customers.',
      href: '/services/marketing',
    },
    {
      number: '02',
      title: 'Ad Campaigns',
      description:
        'Comprehensive strategies that elevate your brand and put it in front of the right people at the right moment.',
      href: '/services/ad-campaigns',
    },
  ],
  [
    {
      number: '03',
      title: 'Web Development',
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
  ],
]

const ServiceBeat = forwardRef<HTMLDivElement, { services: [Service, Service] }>(
  ({ services }, ref) => {
    const [left, right] = services
    return (
      <div ref={ref} className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
        <div
          className="grid h-full w-full grid-cols-1 items-center gap-8 px-8 pt-28 pb-40 md:grid-cols-3 md:px-12 md:pt-32 lg:px-16"
          style={{ pointerEvents: 'auto' }}
        >
          <ServiceCard service={left} align="left" />
          <div className="hidden md:block" aria-hidden />
          <ServiceCard service={right} align="right" />
        </div>
      </div>
    )
  }
)
ServiceBeat.displayName = 'ServiceBeat'

const ServiceCard = ({
  service,
  align,
}: {
  service: Service
  align: 'left' | 'right'
}) => {
  const alignClass = align === 'left' ? 'text-left items-start' : 'text-right items-end'
  return (
    <div className={`flex max-w-md flex-col gap-5 ${alignClass}`}>
      <span
        className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/55"
        style={{ fontFamily: 'var(--font-body, system-ui)' }}
      >
        {service.number} — Service
      </span>

      <h3
        className="leading-[0.9] text-white"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 5vw, 5rem)',
          letterSpacing: '-0.01em',
        }}
      >
        {service.title}
      </h3>

      <p
        className="text-balance text-sm leading-relaxed text-white/80 md:text-base"
        style={{ fontFamily: 'var(--font-body, system-ui)', maxWidth: '32ch' }}
      >
        {service.description}
      </p>

      <Link
        href={service.href}
        className="group mt-2 inline-flex items-center gap-3 self-start border-b border-white/30 pb-1 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:border-white"
        style={align === 'right' ? { alignSelf: 'flex-end' } : undefined}
      >
        Explore
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  )
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fadeOverlayRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const wordmarkRef = useRef<HTMLHeadingElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)

  const beat0Ref = useRef<HTMLDivElement>(null)
  const beat1Ref = useRef<HTMLDivElement>(null)
  const beat2Ref = useRef<HTMLDivElement>(null)

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
          overlay.style.opacity = String(fadeProgress)
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
            overlay.style.opacity = String(1 - t)
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

  // ── GSAP INTRO TIMELINE ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        videoRef.current,
        { opacity: 0 },
        { opacity: 0.9, duration: 1.6, ease: 'power2.inOut' },
        0.1
      )

      tl.fromTo(
        [labelRef.current, taglineRef.current, ctaRef.current],
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.12 },
        0.6
      )

      const chars = wordmarkRef.current?.querySelectorAll('.char')
      if (chars) {
        tl.fromTo(
          chars,
          { y: '110%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 1.2, stagger: 0.04, ease: 'expo.out' },
          0.8
        )
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // ── PINNED SCROLL STORY ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!beat0Ref.current || !beat1Ref.current || !beat2Ref.current) return

      gsap.set(beat1Ref.current, { yPercent: 100, opacity: 0 })
      gsap.set(beat2Ref.current, { yPercent: 100, opacity: 0 })

      const tl = gsap.timeline({
  scrollTrigger: {
    trigger: heroRef.current,
    start: 'top top',
    end: '+=450%',
    scrub: 1,
    pin: true,
    anticipatePin: 1,
  },
})

      // ── BEAT 0 → BEAT 1 ──
      tl.to(beat0Ref.current, { yPercent: -100, opacity: 0, ease: 'power2.inOut' }, 0)
      tl.to(wordmarkRef.current, { yPercent: 110, opacity: 0, ease: 'power2.inOut' }, 0)
      tl.to(beat1Ref.current, { yPercent: 0, opacity: 1, ease: 'power2.inOut' }, 0)
      tl.to(
        gradientRef.current,
        { filter: 'hue-rotate(40deg) saturate(1.3)', ease: 'none' },
        0
      )

      tl.to({}, { duration: 0.3 })

      // ── BEAT 1 → BEAT 2 ──
      tl.to(beat1Ref.current, { yPercent: -100, opacity: 0, ease: 'power2.inOut' }, '>')
      tl.to(beat2Ref.current, { yPercent: 0, opacity: 1, ease: 'power2.inOut' }, '<')
      tl.to(
        gradientRef.current,
        { filter: 'hue-rotate(120deg) saturate(1.4)', ease: 'none' },
        '<'
      )

      // ── HOLD BEAT 2 (gives VideoIntro room to reveal) ──
      tl.to({}, { duration: 0.5 })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const wordmark = 'Splash Media'

  return (
    <section
  ref={heroRef}
  data-hero
  className="relative h-screen w-full overflow-hidden"
  style={{ background: '#020617' }}
>
      <div ref={gradientRef} className="absolute inset-0 z-0">
        <div className="gradient-mesh absolute inset-0" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 z-[2] h-full w-full object-cover"
        style={{
          mixBlendMode: 'screen',
          opacity: 0.9,
        }}
      >
        <source src="/videos/ms.mp4" type="video/mp4" />
      </video>

      <div
        ref={fadeOverlayRef}
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          opacity: 0,
          background:
            'linear-gradient(135deg, #020617 0%, #0c1733 50%, #0a1a2e 100%)',
        }}
      />

      <div ref={beat0Ref} className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
        <div
          className="absolute right-8 top-28 max-w-sm text-right md:right-12 md:top-32 lg:right-16"
          style={{ pointerEvents: 'auto' }}
        >
          <div
            ref={labelRef}
            className="mb-4 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-white/70"
          >
            <span className="inline-block h-px w-8 bg-white/40" />
            Salt Lake City · Est. 2010
          </div>

          <p
            ref={taglineRef}
            className="mb-6 text-balance text-sm leading-relaxed text-white/85 md:text-base"
            style={{ fontFamily: 'var(--font-body, system-ui)' }}
          >
            A Utah marketing agency built for brands that refuse to blend in.
            Strategy, design, and campaigns that move the needle — and the crowd.
          </p>

          <Link
            ref={ctaRef}
            href="/contact"
            className="group inline-flex items-center gap-3 border-b border-white/30 pb-1 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:border-white"
          >
            Make a Splash
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>

      <ServiceBeat ref={beat1Ref} services={servicePairs[0]} />
      <ServiceBeat ref={beat2Ref} services={servicePairs[1]} />

      <h1
        ref={wordmarkRef}
        className="absolute bottom-0 left-0 right-0 z-10 select-none px-4 pb-6 text-center leading-[0.85] text-white md:pb-8"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(4rem, 13vw, 21rem)',
          letterSpacing: '0em',
          fontWeight: 500,
          pointerEvents: 'none',
        }}
        aria-label={wordmark}
      >
        <span className="inline-block overflow-hidden align-bottom">
          {wordmark.split('').map((char, i) => (
            <span
              key={i}
              className="char inline-block"
              style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
            >
              {char}
            </span>
          ))}
        </span>
      </h1>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] h-1/2"
        style={{
          background:
            'linear-gradient(to top, rgba(2, 6, 23, 0.6) 0%, rgba(2, 6, 23, 0) 100%)',
        }}
      />

      <style jsx>{`
        .gradient-mesh {
          background:
            radial-gradient(circle at 20% 30%, #0ea5e9 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 55%),
            radial-gradient(circle at 60% 80%, #3b82f6 0%, transparent 50%),
            radial-gradient(circle at 30% 70%, #0891b2 0%, transparent 60%),
            linear-gradient(135deg, #020617 0%, #0c1733 50%, #0a1a2e 100%);
          background-size: 200% 200%;
          animation: meshShift 18s ease-in-out infinite;
          filter: saturate(1.15);
        }

        @keyframes meshShift {
          0%, 100% { background-position: 0% 0%, 100% 0%, 50% 100%, 0% 50%, 0% 0%; }
          25% { background-position: 30% 20%, 70% 40%, 80% 60%, 20% 80%, 0% 0%; }
          50% { background-position: 60% 50%, 30% 70%, 40% 30%, 80% 20%, 0% 0%; }
          75% { background-position: 80% 80%, 10% 30%, 20% 50%, 60% 60%, 0% 0%; }
        }
      `}</style>
    </section>
  )
}