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
]

// ─────────────────────────────────────────────
// SERVICES BEAT
// ─────────────────────────────────────────────
const ServicesBeat = forwardRef<
  HTMLDivElement,
  {
    leftColRef: React.RefObject<HTMLDivElement | null>
    rightColRef: React.RefObject<HTMLDivElement | null>
  }
>(({ leftColRef, rightColRef }, ref) => {
  return (
    <div ref={ref} className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
      <div
        className="relative grid h-full w-full grid-cols-1 items-stretch px-6 pt-20 pb-24 md:grid-cols-2 md:px-12 md:pt-24 md:pb-28 lg:px-20"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="absolute left-1/2 top-8 z-10 -translate-x-1/2 md:top-10">
          <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.4em] text-white/70 md:text-[11px]">
            <span className="inline-block h-px w-8 bg-white/40" />
            What We Do
            <span className="inline-block h-px w-8 bg-white/40" />
          </div>
        </div>

        <div
          ref={leftColRef}
          className="flex flex-col justify-center gap-12 pr-0 md:gap-16 md:pr-12 lg:pr-16"
        >
          <ServiceCard service={services[0]} align="left" />
          <ServiceCard service={services[1]} align="left" />
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
          aria-hidden
          style={{ height: '60%', width: '1px' }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.3) 80%, transparent 100%)',
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.5) 40%, transparent 70%)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: '20%',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.5)',
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: '80%',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.5)',
            }}
          />
        </div>

        <div
          ref={rightColRef}
          className="flex flex-col justify-center gap-12 pl-0 md:gap-16 md:pl-12 lg:pl-16"
        >
          <ServiceCard service={services[2]} align="right" />
          <ServiceCard service={services[3]} align="right" />
        </div>
      </div>
    </div>
  )
})
ServicesBeat.displayName = 'ServicesBeat'

const ServiceCard = ({
  service,
  align,
}: {
  service: Service
  align: 'left' | 'right'
}) => {
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
        style={{
          fontFamily: 'var(--font-body, system-ui)',
          maxWidth: '32ch',
        }}
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

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const wordmarkRef = useRef<HTMLHeadingElement>(null)
  const wordmarkTaglineRef = useRef<HTMLParagraphElement>(null)
  const bgPinkRef = useRef<HTMLDivElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)

  const beat0Ref = useRef<HTMLDivElement>(null)
  const beat1Ref = useRef<HTMLDivElement>(null)

  // ── VIDEO LOOP ──
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const LOOP_END = 12

    const handleTimeUpdate = () => {
      if (video.currentTime >= LOOP_END) {
        video.currentTime = 0
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.play().catch(() => {})

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [])

  // ── INTRO TIMELINE ──
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

      tl.fromTo(
        wordmarkTaglineRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' },
        1.2
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
      if (!beat0Ref.current || !beat1Ref.current) return

      gsap.set(beat1Ref.current, { yPercent: 100, opacity: 0 })
      gsap.set(bgPinkRef.current, { opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      // BEAT 0 → BEAT 1 (services slide in on pink)
      tl.to(beat0Ref.current, { yPercent: -100, opacity: 0, ease: 'power2.inOut', duration: 0.5 }, 0)
      tl.to(wordmarkRef.current, { yPercent: 110, opacity: 0, ease: 'power2.inOut', duration: 0.5 }, 0)
      tl.to(wordmarkTaglineRef.current, { y: -60, opacity: 0, ease: 'power2.inOut', duration: 0.5 }, 0)
      tl.to(beat1Ref.current, { yPercent: 0, opacity: 1, ease: 'power2.inOut', duration: 0.5 }, 0)
      tl.to(bgPinkRef.current, { opacity: 1, ease: 'none', duration: 0.5 }, 0)

      // Hold so services are fully visible
      tl.to({}, { duration: 0.3 })

      // EXIT — services slide sideways, splash fades
      tl.to(
        leftColRef.current,
        { xPercent: -120, opacity: 0, ease: 'power3.in', duration: 0.5 },
        '>'
      )
      tl.to(
        rightColRef.current,
        { xPercent: 120, opacity: 0, ease: 'power3.in', duration: 0.5 },
        '<'
      )
      tl.fromTo(
        videoRef.current,
        { opacity: 0.9 },
        { opacity: 0, ease: 'power2.inOut', duration: 0.5 },
        '<'
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const wordmark = 'Splash Media'

  return (
    <section
      ref={heroRef}
      data-hero
      className="relative h-screen w-full overflow-hidden"
      style={{
        // BEAT 0 base — bright vibrant blue layered gradient
        background: `
          radial-gradient(circle at 30% 20%, #5eb8f5 0%, transparent 40%),
          radial-gradient(circle at 70% 35%, #1e88e5 0%, transparent 45%),
          radial-gradient(circle at 50% 80%, #2563eb 0%, transparent 50%),
          radial-gradient(circle at 25% 75%, #0ea5e9 0%, transparent 45%),
          linear-gradient(135deg, #0a3a6f 0%, #0e4a85 50%, #082752 100%)
        `,
      }}
    >
      {/* PINK OVERLAY (fades in on scroll for the services beat) */}
      <div
        ref={bgPinkRef}
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          opacity: 0,
          background: `
            radial-gradient(circle at 20% 30%, #ec4899 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #f472b6 0%, transparent 55%),
            radial-gradient(circle at 60% 80%, #c026d3 0%, transparent 50%),
            radial-gradient(circle at 30% 70%, #be185d 0%, transparent 60%),
            linear-gradient(135deg, #500724 0%, #831843 50%, #4a044e 100%)
          `,
        }}
      />

      {/* SPLASH VIDEO */}
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

      {/* BEAT 0 */}
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

      {/* BEAT 1 — services */}
      <ServicesBeat ref={beat1Ref} leftColRef={leftColRef} rightColRef={rightColRef} />

      {/* PREMIUM TAGLINE */}
      <p
        ref={wordmarkTaglineRef}
        className="pointer-events-none absolute bottom-[28%] left-0 right-0 z-10 text-center md:bottom-[32%]"
        style={{
          fontFamily: 'var(--font-body, sans-serif)',
          fontSize: 'clamp(0.7rem, 0.85vw, 0.9rem)',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.75)',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
        }}
      >
        <span style={{ opacity: 0.55 }}>—</span>
        &nbsp;&nbsp;Premium Creative for Utah&apos;s Most Ambitious Brands&nbsp;&nbsp;
        <span style={{ opacity: 0.55 }}>—</span>
      </p>

      {/* SPLASH MEDIA wordmark */}
      <h1
        ref={wordmarkRef}
        className="splash-wordmark absolute bottom-0 left-0 right-0 z-10 select-none px-4 pb-24 text-center leading-[0.95] md:pb-24"
        style={{
          fontFamily: 'var(--font-condensed)',
          fontSize: 'clamp(4rem, 20vw, 21rem)',
          letterSpacing: '0em',
          fontWeight: 700,
          textTransform: 'uppercase',
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

      {/* Bottom gradient fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] h-1/2"
        style={{
          background:
            'linear-gradient(to top, rgba(2, 6, 23, 0.6) 0%, rgba(2, 6, 23, 0) 100%)',
        }}
      />

      <style jsx>{`
        .splash-wordmark {
          filter: drop-shadow(0 0 30px rgba(125, 200, 255, 0.3))
            drop-shadow(0 0 60px rgba(80, 150, 220, 0.2));
        }

        .splash-wordmark .char {
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #d6ecff 40%,
            #7cb8f0 70%,
            #4f8ed4 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
      `}</style>
    </section>
  )
}