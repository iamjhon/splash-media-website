'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─────────────────────────────────────────────
// TESTIMONIAL DATA
// Each card gets its own accent color for personality
// ─────────────────────────────────────────────
type Testimonial = {
  quote: string
  name: string
  role?: string
  initials: string
  accentColor: string
  cardBg: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      "You won't find a better team than Splash Media to work with when it comes to making your event special. Randy and his amazing staff are some of the hardest working people I've ever met. Give them a shot, you won't be disappointed — and tell them, Big T Bailey sent ya.",
    name: 'Thurl Bailey',
    role: 'NBA Champion · Salt Lake Legend',
    initials: 'TB',
    accentColor: '#5eb8f5',
    cardBg: 'linear-gradient(135deg, #1e88e5 0%, #0d47a1 100%)',
  },
  {
    quote:
      "I have been using Splash Media for my business for years and they've done an awesome job with several different products and projects. I highly recommend Randy and his team!",
    name: 'Marlene Gonzalez',
    role: 'Attorney',
    initials: 'MG',
    accentColor: '#f472b6',
    cardBg: 'linear-gradient(135deg, #db2777 0%, #831843 100%)',
  },
  {
    quote:
      'The Utah chapter had the pleasure to have Splash Media as one of the sponsors for our 4th Annual Event at Utah Capitol South Square. A global non-profit organization with 89 chapters across 30 countries — and they delivered.',
    name: 'GFCBW Utah',
    role: 'Chinese Business Women · Global Federation',
    initials: 'GF',
    accentColor: '#14b8a6',
    cardBg: 'linear-gradient(135deg, #0d9488 0%, #064e3b 100%)',
  },
]

const HEADLINE = 'What our partners say about working with us.'

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const charsRef = useRef<HTMLSpanElement[]>([])
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const cardWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !cardWrapRef.current) return

      const chars = charsRef.current.filter(Boolean)
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]

      gsap.set(chars, { opacity: 0.12 })
      cards.forEach((card, i) => {
        if (!card) return
        gsap.set(card, {
          yPercent: 130 + i * 8,
          opacity: 0,
          rotation: i === 0 ? -1.5 : i === 1 ? 1 : -0.5,
        })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          // Fire earlier so transition from VideoIntro is seamless
          start: 'top top',
          end: '+=500%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          pinSpacing: true,
        },
      })

      // ── PHASE 1: short delay then headline reveal ──
      // (Lets VideoIntro fully transition out)
      tl.to({}, { duration: 0.3 })

      // Character reveal
      tl.to(
        chars,
        {
          opacity: 1,
          stagger: { each: 0.04, from: 'start' },
          ease: 'none',
          duration: 0.4,
        },
        '>'
      )

      // Pause to let viewer enjoy the headline
      tl.to({}, { duration: 0.2 })

      // ── PHASE 2: Cards stack ──
      cards.forEach((card, i) => {
        const cardOffset = i * 50
        const scaleDown = 1 - (cards.length - 1 - i) * 0.04

        tl.to(
          card,
          {
            y: cardOffset,
            yPercent: 0,
            opacity: 1,
            scale: scaleDown,
            rotation: 0,
            ease: 'power3.out',
            duration: 0.6,
          },
          '>0.05'
        )

        if (i < cards.length - 1) {
          tl.to({}, { duration: 0.25 })
        }
      })

      tl.to({}, { duration: 0.4 })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 25% 20%, #5eb8f5 0%, transparent 45%),
          radial-gradient(circle at 75% 80%, #1e88e5 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, #2563eb 0%, transparent 55%),
          radial-gradient(circle at 15% 75%, #0ea5e9 0%, transparent 45%),
          linear-gradient(135deg, #0a3a6f 0%, #0e4a85 50%, #082752 100%)
        `,
      }}
    >
      {/* Floating accent circles for visual interest */}
      <div
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f472b6 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)' }}
      />

      {/* ── EYEBROW + BIG HEADLINE ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-16">
        <p
          className="mb-8 text-[10px] uppercase tracking-[0.4em] text-white/60 md:mb-12 md:text-[12px]"
          style={{ fontFamily: 'var(--font-narrow, sans-serif)' }}
        >
          ◊ Testimonials ◊
        </p>

        <h2
          ref={headlineRef}
          className="max-w-6xl text-balance text-center"
          style={{
            fontFamily: 'var(--font-display, var(--font-heading))',
            fontSize: 'clamp(2.5rem, 6.5vw, 6.5rem)',
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            textTransform: 'uppercase',
          }}
        >
          {HEADLINE.split('').map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) charsRef.current[i] = el
              }}
              style={{
                display: 'inline-block',
                whiteSpace: char === ' ' ? 'pre' : 'normal',
              }}
            >
              {char}
            </span>
          ))}
        </h2>
      </div>

      {/* ── STACKING CARDS ── */}
      <div
        ref={cardWrapRef}
        className="absolute inset-0 flex items-center justify-center px-4 md:px-8"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="relative w-full"
          style={{
            maxWidth: 'min(95vw, 1100px)',
            height: 'min(75vh, 580px)',
          }}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={i}
              ref={(el) => {
                cardsRef.current[i] = el
              }}
              testimonial={t}
              index={i}
              zIndex={10 + i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// EDITORIAL CARD — bigger, asymmetric, modern
// ─────────────────────────────────────────────
type CardProps = {
  testimonial: Testimonial
  index: number
  zIndex: number
}

const TestimonialCard = ({
  ref,
  testimonial: t,
  index,
  zIndex,
}: CardProps & { ref: (el: HTMLDivElement | null) => void }) => {
  return (
    <div
      ref={ref}
      className="absolute inset-0 grid overflow-hidden rounded-3xl md:grid-cols-[1.4fr_1fr]"
      style={{
        zIndex,
        background: t.cardBg,
        boxShadow:
          '0 -30px 60px -20px rgba(0, 0, 0, 0.5), 0 30px 80px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
        pointerEvents: 'auto',
      }}
    >
      {/* Decorative pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='p' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23fff'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23p)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── LEFT: Quote ── */}
      <div className="relative flex flex-col justify-between p-8 md:p-12 lg:p-16">
        {/* Massive index number */}
        <div
          aria-hidden
          className="mb-6 flex items-baseline gap-4"
          style={{
            fontFamily: 'var(--font-display, sans-serif)',
            color: 'rgba(255, 255, 255, 0.3)',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            0{index + 1}
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            / 0{testimonials.length}
          </span>
        </div>

        {/* Quote text */}
        <p
          className="text-balance"
          style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: 'clamp(1.1rem, 1.9vw, 1.75rem)',
            lineHeight: 1.3,
            color: '#ffffff',
            fontWeight: 500,
            letterSpacing: '-0.015em',
          }}
        >
          &ldquo;{t.quote}&rdquo;
        </p>

        {/* Decorative line */}
        <div className="mt-8 h-px w-16" style={{ background: t.accentColor }} />
      </div>

      {/* ── RIGHT: Attribution panel ── */}
      <div
        className="relative flex flex-col items-start justify-between p-8 md:p-12 lg:p-16"
        style={{
          background: 'rgba(0, 0, 0, 0.18)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Avatar with initials */}
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full md:h-24 md:w-24"
          style={{
            background: t.accentColor,
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#0a1a2e',
            letterSpacing: '-0.02em',
            boxShadow: `0 8px 24px ${t.accentColor}40`,
          }}
        >
          {t.initials}
        </div>

        {/* Name + role */}
        <div className="mt-auto w-full">
          <p
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            {t.name}
          </p>
          {t.role && (
            <p
              style={{
                fontFamily: 'var(--font-narrow, sans-serif)',
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.7)',
                letterSpacing: '0.15em',
                marginTop: '8px',
                textTransform: 'uppercase',
              }}
            >
              {t.role}
            </p>
          )}

          {/* Star rating */}
          <div className="mt-4 flex gap-1">
            {[0, 1, 2, 3, 4].map((s) => (
              <svg
                key={s}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={t.accentColor}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 .587l3.668 7.568L24 9.75l-6 5.848 1.416 8.268L12 19.771l-7.416 3.895L6 15.598 0 9.75l8.332-1.595z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}