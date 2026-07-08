'use client'

import { useEffect, useRef } from 'react'
import SplashButton from '@/components/layout/SplashButton'
import styles from './SplashCTA.module.css'

export default function SplashCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const btnRef = useRef<HTMLDivElement>(null)
  const dropsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Reveal on intersection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add(styles.visible)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(section)

    // Parallax scroll effect
    let rafId: number
    const tick = () => {
      const rect = section.getBoundingClientRect()
      const viewportH = window.innerHeight

      // Progress: 0 when section enters viewport from bottom, 1 when it leaves top
      const total = viewportH + rect.height
      const scrolled = viewportH - rect.top
      const p = Math.max(0, Math.min(1, scrolled / total))

      // Centered progress: -0.5 → 0 → 0.5 (negative when below center, positive when above)
      const centered = p - 0.5

      // Parallax movements on each element (different speeds for layered feel)
      if (eyebrowRef.current) {
        eyebrowRef.current.style.transform = `translateY(${centered * -40}px)`
      }
      if (titleRef.current) {
        titleRef.current.style.transform = `translateY(${centered * -80}px)`
      }
      if (subRef.current) {
        subRef.current.style.transform = `translateY(${centered * -50}px)`
      }
      if (btnRef.current) {
        btnRef.current.style.transform = `translateY(${centered * -30}px)`
      }
      if (dropsRef.current) {
        // Background drops move opposite direction for depth
        dropsRef.current.style.transform = `translateY(${centered * 100}px)`
      }

      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Parallax background drops */}
      <div ref={dropsRef} className={styles.drops} aria-hidden>
        <span className={styles.drop} style={{ top: '15%', left: '8%', width: '120px', height: '120px' }} />
        <span className={styles.drop} style={{ top: '70%', left: '15%', width: '60px', height: '60px' }} />
        <span className={styles.drop} style={{ top: '25%', right: '12%', width: '180px', height: '180px' }} />
        <span className={styles.drop} style={{ top: '75%', right: '20%', width: '90px', height: '90px' }} />
        <span className={styles.drop} style={{ top: '50%', left: '45%', width: '40px', height: '40px' }} />
      </div>

      {/* Subtle wave SVG at bottom */}
      <svg className={styles.wave} viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
        <path d="M0,60 C200,20 400,90 720,60 C1040,30 1240,80 1440,50 L1440,120 L0,120 Z" fill="url(#cta-wave)" />
        <defs>
          <linearGradient id="cta-wave" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5eb8f5" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1e6fc4" stopOpacity="0.25" />
          </linearGradient>
        </defs>
      </svg>

      <div className={styles.content}>
        <p ref={eyebrowRef} className={styles.eyebrow}>
          Let&apos;s Work Together
        </p>
        <h2 ref={titleRef} className={styles.title}>
          Are you ready to make a{' '}
          <span className={styles.accent}>splash</span>?
        </h2>
        <p ref={subRef} className={styles.subtitle}>
          Whether you&apos;re a startup ready to dive in or an established brand
          looking for fresh waves, we&apos;re here to help you stand out.
        </p>
        <div ref={btnRef} className={styles.buttonWrap}>
          <SplashButton color="blue" size="lg" href="/contact">
            Schedule a Consultation
          </SplashButton>
        </div>
      </div>
    </section>
  )
}