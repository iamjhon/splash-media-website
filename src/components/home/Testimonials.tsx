'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

type Testimonial = {
  index: string
  quote: string
  name: string
  role: string
  initials: string
  accent: string
}

const testimonials: Testimonial[] = [
  {
    index: '01',
    quote:
      'Splash Media transformed how our nonprofit reaches the community. Their strategy moves the needle every quarter — and they make it feel effortless.',
    name: 'Thurl Bailey',
    role: 'NBA Champion · Salt Lake Legend',
    initials: 'TB',
    accent: '#60a5fa', // matches electric blue morph
  },
  {
    index: '02',
    quote:
      'I needed a marketing partner who understands the legal industry — Splash Media delivered. Their campaigns brought in qualified leads from day one.',
    name: 'Marlene Gonzalez',
    role: 'Attorney',
    initials: 'MG',
    accent: '#f472b6', // matches deep magenta morph
  },
  {
    index: '03',
    quote:
      'Working with Splash Media has elevated our brand on a national scale. They understand our mission and translate it into work that resonates.',
    name: 'GFCBW Utah',
    role: 'Chinese Business Women Global Federation',
    initials: 'GF',
    accent: '#2dd4bf', // matches teal morph
  },
]

// ─────────────────────────────────────────────
// HEADER WITH CHAR REVEAL
// ─────────────────────────────────────────────
const HEADING_TEXT = 'What our partners say about working with us.'

const TestimonialsHeader = () => {
  const charsRef = useRef<HTMLSpanElement[]>([])
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        charsRef.current,
        { opacity: 0.12, y: 0 },
        {
          opacity: 1,
          duration: 0.8,
          stagger: 0.018,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 75%',
            end: 'bottom 50%',
            scrub: 1,
          },
        }
      )
    }, headerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={headerRef} className="mx-auto max-w-5xl px-6 pt-32 pb-20 text-center md:pt-40 md:pb-24">
      <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.4em] text-white/60 md:text-[11px]">
        <span className="inline-block h-px w-8 align-middle bg-white/40 mr-3" />
        Testimonials
        <span className="inline-block h-px w-8 align-middle bg-white/40 ml-3" />
      </p>
      <h2
        className="text-balance leading-[1.05] text-white"
        style={{
          fontFamily: 'var(--font-display, sans-serif)',
          fontSize: 'clamp(2.5rem, 5vw, 5.5rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        {HEADING_TEXT.split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) charsRef.current[i] = el
            }}
            style={{
              display: 'inline-block',
              whiteSpace: char === ' ' ? 'pre' : 'normal',
              opacity: 0.12,
            }}
          >
            {char}
          </span>
        ))}
      </h2>
    </div>
  )
}

// ─────────────────────────────────────────────
// SINGLE TESTIMONIAL CARD
// ─────────────────────────────────────────────
const TestimonialCard = ({
  testimonial,
  total,
  cardRef,
}: {
  testimonial: Testimonial
  total: number
  cardRef: React.RefObject<HTMLDivElement | null>
}) => {
  return (
    <div
      ref={cardRef}
      className="relative mx-auto mb-32 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 px-8 py-12 backdrop-blur-md md:px-14 md:py-16"
      style={{
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        boxShadow:
          '0 30px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {/* Massive index number behind */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-6 top-2 select-none md:right-10 md:top-4"
        style={{
          fontFamily: 'var(--font-display, sans-serif)',
          fontSize: 'clamp(7rem, 13vw, 13rem)',
          fontWeight: 700,
          color: 'rgba(255, 255, 255, 0.04)',
          letterSpacing: '-0.04em',
          lineHeight: 0.85,
        }}
      >
        {testimonial.index}
        <span style={{ fontSize: '0.45em', opacity: 0.6 }}> / 0{total}</span>
      </span>

      <div className="relative z-10 grid gap-8 md:grid-cols-[1.4fr_1fr] md:gap-12">
        {/* QUOTE */}
        <div>
          <span
            aria-hidden
            className="block text-[6rem] leading-none"
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              color: testimonial.accent,
              opacity: 0.65,
              marginTop: '-2rem',
              marginBottom: '-2rem',
            }}
          >
            “
          </span>
          <p
            className="text-balance text-xl italic leading-snug text-white/95 md:text-2xl"
            style={{ fontFamily: 'var(--font-body, serif)' }}
          >
            {testimonial.quote}
          </p>
        </div>

        {/* ATTRIBUTION */}
        <div className="flex flex-col items-start gap-5 md:items-end md:text-right">
          <div className="flex items-center gap-4 md:flex-row-reverse">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-medium text-white md:h-16 md:w-16 md:text-base"
              style={{
                background: `linear-gradient(135deg, ${testimonial.accent}AA 0%, ${testimonial.accent}33 100%)`,
                border: `1px solid ${testimonial.accent}66`,
                fontFamily: 'var(--font-narrow, sans-serif)',
                letterSpacing: '0.05em',
              }}
            >
              {testimonial.initials}
            </div>

            <div className="flex flex-col md:items-end">
              <p
                className="text-base font-medium uppercase tracking-[0.15em] text-white md:text-lg"
                style={{ fontFamily: 'var(--font-narrow, sans-serif)' }}
              >
                {testimonial.name}
              </p>
              <p
                className="text-[11px] uppercase tracking-[0.25em] text-white/55 md:text-xs"
                style={{ fontFamily: 'var(--font-body, sans-serif)' }}
              >
                {testimonial.role}
              </p>
            </div>
          </div>

          <div className="flex gap-1" style={{ color: testimonial.accent }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-lg">★</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// TESTIMONIALS SECTION
// ─────────────────────────────────────────────
export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const card1Ref = useRef<HTMLDivElement | null>(null)
  const card2Ref = useRef<HTMLDivElement | null>(null)
  const card3Ref = useRef<HTMLDivElement | null>(null)

  // Each card slides up + rotates slightly on entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = [card1Ref.current, card2Ref.current, card3Ref.current].filter(Boolean)
      const rotations = [-1.5, 1, -0.5]

      cards.forEach((card, i) => {
        if (!card) return

        gsap.fromTo(
          card,
          { y: 120, opacity: 0, rotate: rotations[i] * 2 },
          {
            y: 0,
            opacity: 1,
            rotate: rotations[i],
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              end: 'top 40%',
              scrub: 1.2,
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full pb-32 md:pb-40"
      style={{ background: 'transparent' }}
    >
      <TestimonialsHeader />

      <div className="px-4 md:px-6">
        <TestimonialCard testimonial={testimonials[0]} total={testimonials.length} cardRef={card1Ref} />
        <TestimonialCard testimonial={testimonials[1]} total={testimonials.length} cardRef={card2Ref} />
        <TestimonialCard testimonial={testimonials[2]} total={testimonials.length} cardRef={card3Ref} />
      </div>
    </section>
  )
}