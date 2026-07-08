'use client'

import { useEffect, useState } from 'react'

type Testimonial = {
  quote: string
  name: string
  role: string
  avatar: string // path to circle thumbnail image
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'They transformed how our brand shows up online.',
    name: 'Thurl Bailey',
    role: 'NBA Champion',
    avatar: '/images/testimonials/thurl.jpg',
  },
  {
    quote: 'Understood our vision from day one and delivered beyond it.',
    name: 'Marlene Gonzalez',
    role: 'Attorney',
    avatar: '/images/testimonials/marlene.png',
  },
  {
    quote: 'Impactful campaigns that actually move the needle.',
    name: 'GFCBW Utah',
    role: 'Global Federation',
    avatar: '/images/testimonials/gfcbw.png',
  },
]

export default function HeroTestimonials() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length)
    }, 4500)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      style={{
        width: 'clamp(320px, 60%, 720px)',
        margin: '2rem auto 0',
        borderRadius: '999px',
        padding: '0.75rem 1.5rem',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        boxShadow:
          '0 12px 40px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255,255,255,0.15)',
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {/* Rotating avatar + testimonial in one row */}
      <div style={{ position: 'relative', flex: 1, minHeight: '3rem' }}>
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            style={{
              position: i === index ? 'relative' : 'absolute',
              inset: 0,
              opacity: i === index ? 1 : 0,
              transform: i === index ? 'translateX(0)' : 'translateX(10px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              pointerEvents: i === index ? 'auto' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.9rem',
            }}
          >
            {/* Circle thumbnail */}
            <span
              style={{
                flexShrink: 0,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                display: 'block',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.avatar}
                alt={t.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </span>

            {/* Quote + attribution */}
            <div style={{ minWidth: 0, textAlign: 'left' }}>
              <p
                style={{
                  fontFamily: 'var(--font-body, sans-serif)',
                  fontSize: 'clamp(0.85rem, 1vw, 1rem)',
                  lineHeight: 1.3,
                  color: 'rgba(255,255,255,0.95)',
                  margin: 0,
                  fontStyle: 'italic',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                “{t.quote}”
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body, sans-serif)',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                  margin: '0.15rem 0 0',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.name}
                <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>
                  {' '}· {t.role}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stars */}
      <div
        style={{
          flexShrink: 0,
          color: '#5eb8f5',
          fontSize: '0.8rem',
          letterSpacing: '0.05em',
        }}
        aria-hidden
      >
        ★★★★★
      </div>
    </div>
  )
}