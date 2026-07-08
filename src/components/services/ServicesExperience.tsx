'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplashButton from '@/components/layout/SplashButton'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
type Service = {
  number: string
  title: string
  tagline: string
  description: string
  capabilities: string[]
  href: string
  accent: string
  // Background gradient for this service's phase
  bg: string
}

const services: Service[] = [
  {
    number: '01',
    title: 'Marketing',
    tagline: 'Reach the right audience, everywhere.',
    description:
      'TV, radio, social, Google Ads, and local SEO — campaigns engineered to amplify reach and convert audiences into loyal customers.',
    capabilities: ['TV & Radio', 'Social Media', 'Google Ads', 'Local SEO', 'Content Strategy'],
    href: '/services/marketing',
    accent: '#60a5fa',
    bg: `
      radial-gradient(circle at 20% 30%, #3b82f6 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, #60a5fa 0%, transparent 55%),
      radial-gradient(circle at 60% 80%, #1e40af 0%, transparent 50%),
      radial-gradient(circle at 30% 70%, #1d4ed8 0%, transparent 60%),
      linear-gradient(135deg, #0c1e3e 0%, #1e3a8a 50%, #1e1b4b 100%)
    `,
  },
  {
    number: '02',
    title: 'Ad Campaigns',
    tagline: 'Strategy that puts you center stage.',
    description:
      'Comprehensive campaigns that elevate your brand and put it in front of the right people at the right moment — built to convert.',
    capabilities: ['Brand Strategy', 'Creative Direction', 'Media Buying', 'A/B Testing', 'Analytics'],
    href: '/services/ad-campaigns',
    accent: '#fbbf24',
    bg: `
      radial-gradient(circle at 20% 30%, #f59e0b 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, #fbbf24 0%, transparent 55%),
      radial-gradient(circle at 60% 80%, #d97706 0%, transparent 50%),
      radial-gradient(circle at 30% 70%, #b45309 0%, transparent 60%),
      linear-gradient(135deg, #451a03 0%, #78350f 50%, #422006 100%)
    `,
  },
  {
    number: '03',
    title: 'Web Design',
    tagline: 'Sites built to perform, designed to convert.',
    description:
      'Custom websites, maintenance, local SEO, and full-stack engineering. Premium, animation-rich experiences that turn visitors into clients.',
    capabilities: ['Custom Design', 'Development', 'E-Commerce', 'Maintenance', 'Performance'],
    href: '/services/web-development',
    accent: '#2dd4bf',
    bg: `
      radial-gradient(circle at 20% 30%, #14b8a6 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, #2dd4bf 0%, transparent 55%),
      radial-gradient(circle at 60% 80%, #0f766e 0%, transparent 50%),
      radial-gradient(circle at 30% 70%, #134e4a 0%, transparent 60%),
      linear-gradient(135deg, #042f2e 0%, #115e59 50%, #064e3b 100%)
    `,
  },
  {
    number: '04',
    title: 'Print',
    tagline: 'Tactile brand experiences that leave a mark.',
    description:
      'Business cards, brochures, direct mail, posters, billboards — physical brand experiences crafted with the same care as everything digital.',
    capabilities: ['Business Cards', 'Brochures', 'Direct Mail', 'Billboards', 'Packaging'],
    href: '/services/print',
    accent: '#f472b6',
    bg: `
      radial-gradient(circle at 20% 30%, #ec4899 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, #f472b6 0%, transparent 55%),
      radial-gradient(circle at 60% 80%, #c026d3 0%, transparent 50%),
      radial-gradient(circle at 30% 70%, #be185d 0%, transparent 60%),
      linear-gradient(135deg, #500724 0%, #831843 50%, #4a044e 100%)
    `,
  },
]

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function ServicesExperience() {
  const sectionRef = useRef<HTMLElement>(null)

  // Hero
  const heroRef = useRef<HTMLDivElement>(null)
  const heroTitleCharsRef = useRef<HTMLSpanElement[]>([])

  // Background layers (one per service)
  const bgRefs = useRef<(HTMLDivElement | null)[]>([])

  // Service panels
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])

  // Intro animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = heroTitleCharsRef.current.filter(Boolean)
      gsap.fromTo(
        chars,
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1.1, stagger: 0.04, ease: 'expo.out', delay: 0.2 }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // The big pinned scroll story
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return

      const lerp = (val: number, a: number, b: number) =>
        Math.max(0, Math.min(1, (val - a) / (b - a)))

      // Initial states
      panelRefs.current.forEach((panel, i) => {
        if (panel) gsap.set(panel, { opacity: 0, y: 80 })
        // first bg visible by default via inline style
        void i
      })
      bgRefs.current.forEach((bg, i) => {
        if (bg) gsap.set(bg, { opacity: i === 0 ? 0 : 0 })
      })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=1100%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress

          // ── HERO: visible 0 → 0.10, fades/scales out 0.08 → 0.16 ──
          const heroOut = lerp(p, 0.08, 0.16)
          if (heroRef.current) {
            heroRef.current.style.opacity = String(1 - heroOut)
            heroRef.current.style.transform = `translateY(${-heroOut * 60}px) scale(${1 - heroOut * 0.1})`
          }

          // ── PER-SERVICE PHASES ──
          // Each service occupies a slice of the remaining scroll (0.16 → 1.0)
          // 4 services across 0.16 → 0.96, each ~0.20 wide with overlap for morphs
          const phases = [
            { bgIn: 0.10, panelIn: 0.16, panelOut: 0.34, end: 0.38 },
            { bgIn: 0.34, panelIn: 0.40, panelOut: 0.56, end: 0.60 },
            { bgIn: 0.56, panelIn: 0.62, panelOut: 0.78, end: 0.82 },
            { bgIn: 0.78, panelIn: 0.84, panelOut: 1.10, end: 1.20 },
          ]

          phases.forEach((phase, i) => {
            // Background morph — fades in and stays until next service's bg covers it
            const bg = bgRefs.current[i]
            if (bg) {
              const bgIn = lerp(p, phase.bgIn, phase.bgIn + 0.06)
              bg.style.opacity = String(bgIn)
            }

            // Panel — slides up in, slides up + fades out
            const panel = panelRefs.current[i]
            if (panel) {
              const inP = lerp(p, phase.panelIn, phase.panelIn + 0.05)
              const outP = lerp(p, phase.panelOut, phase.end)
              const visible = Math.max(0, inP - outP)
              const y = (1 - inP) * 80 - outP * 80
              panel.style.opacity = String(visible)
              panel.style.transform = `translate(-50%, -50%) translateY(${y}px)`
              panel.style.pointerEvents = visible > 0.5 ? 'auto' : 'none'
            }
          })
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const HERO_TITLE = 'What We Do'

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 30% 20%, #5eb8f5 0%, transparent 40%),
          radial-gradient(circle at 70% 35%, #1e88e5 0%, transparent 45%),
          radial-gradient(circle at 50% 80%, #2563eb 0%, transparent 50%),
          linear-gradient(135deg, #0a3a6f 0%, #0e4a85 50%, #082752 100%)
        `,
      }}
    >
      {/* ── Per-service background layers ── */}
      {services.map((s, i) => (
        <div
          key={i}
          ref={(el) => {
            bgRefs.current[i] = el
          }}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0,
            zIndex: i + 1,
            willChange: 'opacity',
            background: s.bg,
          }}
        />
      ))}

      {/* ── HERO ── */}
      <div
        ref={heroRef}
        className="absolute inset-0 z-[20] flex flex-col items-center justify-center px-6 text-center"
        style={{ pointerEvents: 'none' }}
      >
        <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.4em] text-white/70 md:text-xs">
          <span className="inline-block h-px w-8 bg-white/40" />
          Our Services
          <span className="inline-block h-px w-8 bg-white/40" />
        </p>
        <h1
          className="text-white"
          style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: 'clamp(3rem, 9vw, 8rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
          }}
          aria-label={HERO_TITLE}
        >
          <span className="inline-block overflow-hidden align-bottom">
            {HERO_TITLE.split('').map((char, i) => (
              <span
                key={i}
                ref={(el) => {
                  if (el) heroTitleCharsRef.current[i] = el
                }}
                className="inline-block"
                style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
              >
                {char}
              </span>
            ))}
          </span>
        </h1>
        <p
          className="mt-6 max-w-xl text-balance text-sm leading-relaxed text-white/80 md:text-base"
          style={{ fontFamily: 'var(--font-body, sans-serif)' }}
        >
          Four disciplines. One mission — to make your brand impossible to ignore.
        </p>

        <div className="mt-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/50">
          <span>Scroll to explore</span>
          <span className="inline-block animate-bounce">↓</span>
        </div>
      </div>

      {/* ── SERVICE PANELS ── */}
      {services.map((s, i) => (
        <div
          key={i}
          ref={(el) => {
            panelRefs.current[i] = el
          }}
          className="absolute left-1/2 top-1/2 z-[25] w-[90%] max-w-6xl px-6"
          style={{
            opacity: 0,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          <div className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
            {/* LEFT: number + title */}
            <div>
              <span
                className="block"
                style={{
                  fontFamily: 'var(--font-display, sans-serif)',
                  fontSize: 'clamp(4rem, 10vw, 9rem)',
                  fontWeight: 700,
                  lineHeight: 0.85,
                  color: s.accent,
                  letterSpacing: '-0.04em',
                }}
              >
                {s.number}
              </span>
              <h2
                className="mt-2 text-white"
                style={{
                  fontFamily: 'var(--font-display, sans-serif)',
                  fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                }}
              >
                {s.title}
              </h2>
              <p
                className="mt-4 text-lg italic text-white/80 md:text-xl"
                style={{ fontFamily: 'var(--font-body, serif)' }}
              >
                {s.tagline}
              </p>
            </div>

            {/* RIGHT: description + capabilities + CTA */}
            <div className="flex flex-col gap-6">
              <p
                className="text-base leading-relaxed text-white/90 md:text-lg"
                style={{ fontFamily: 'var(--font-body, sans-serif)' }}
              >
                {s.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {s.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-white/90"
                    style={{
                      borderColor: `${s.accent}55`,
                      background: `${s.accent}18`,
                      fontFamily: 'var(--font-narrow, sans-serif)',
                    }}
                  >
                    {cap}
                  </span>
                ))}
              </div>

              <div className="mt-2">
                <SplashButton color="neutral" size="md" href={s.href}>
                  Explore {s.title}
                </SplashButton>
              </div>
            </div>
          </div>

          {/* Giant ghost number behind */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-20 right-0 select-none md:-top-32"
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontSize: 'clamp(12rem, 28vw, 30rem)',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.04)',
              letterSpacing: '-0.04em',
              lineHeight: 0.8,
              zIndex: -1,
            }}
          >
            {s.number}
          </span>
        </div>
      ))}

      {/* ── PROGRESS INDICATOR ── */}
      <div className="absolute bottom-8 left-1/2 z-[30] flex -translate-x-1/2 gap-2">
        {services.map((s, i) => (
          <span
            key={i}
            className="h-1.5 w-8 rounded-full"
            style={{ background: 'rgba(255,255,255,0.25)' }}
          />
        ))}
      </div>
    </section>
  )
}