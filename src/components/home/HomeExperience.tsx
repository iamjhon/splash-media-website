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

const REVEAL_PHRASE = "Premium creative for Utah's most ambitious brands."

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
    accent: '#60a5fa',
  },
  {
    index: '02',
    quote:
      'I needed a marketing partner who understands the legal industry — Splash Media delivered. Their campaigns brought in qualified leads from day one.',
    name: 'Marlene Gonzalez',
    role: 'Attorney',
    initials: 'MG',
    accent: '#fbbf24',
  },
  {
    index: '03',
    quote:
      'Working with Splash Media has elevated our brand on a national scale. They understand our mission and translate it into work that resonates.',
    name: 'GFCBW Utah',
    role: 'Chinese Business Women Global Federation',
    initials: 'GF',
    accent: '#2dd4bf',
  },
]

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function HomeExperience() {
  const sectionRef = useRef<HTMLElement>(null)

  // ─── BACKGROUND LAYERS ───
  const pinkBgRef = useRef<HTMLDivElement>(null)
  const blueBgRef = useRef<HTMLDivElement>(null)
  const magentaBgRef = useRef<HTMLDivElement>(null)
  const tealBgRef = useRef<HTMLDivElement>(null)

  // ─── HERO ELEMENTS ───
  const heroSplashRef = useRef<HTMLVideoElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const wordmarkRef = useRef<HTMLHeadingElement>(null)
  const wordmarkTaglineRef = useRef<HTMLParagraphElement>(null)
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
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])

  // ─── TESTIMONIALS ELEMENTS ───
  const testHeaderRef = useRef<HTMLDivElement>(null)
  const testHeaderCharsRef = useRef<HTMLSpanElement[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // ─── HERO SPLASH VIDEO LOOP ───
  useEffect(() => {
    const video = heroSplashRef.current
    if (!video) return

    const LOOP_END = 12
    const handleTimeUpdate = () => {
      if (video.currentTime >= LOOP_END) video.currentTime = 0
    }
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.play().catch(() => {})

    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
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

      tl.fromTo(
        heroSplashRef.current,
        { opacity: 0 },
        { opacity: 0.9, duration: 1.6, ease: 'power2.inOut' },
        0.1
      )

      tl.fromTo(
        [labelRef.current, taglineRef.current, ctaRef.current],
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.12 },
        0.1
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
      gsap.set(phraseCharsRef.current, { opacity: 0, filter: 'blur(10px)', y: 10 })
      gsap.set(aboutCtaRef.current, { opacity: 0, y: 20 })
      gsap.set(pinkBgRef.current, { opacity: 0 })
      gsap.set(blueBgRef.current, { opacity: 0 })
      gsap.set(magentaBgRef.current, { opacity: 0 })
      gsap.set(tealBgRef.current, { opacity: 0 })
      gsap.set(testHeaderRef.current, { opacity: 0 })

      cardRefs.current.forEach((card) => {
        if (card) gsap.set(card, { y: 200, opacity: 0, rotate: 0 })
      })

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
        end: '+=1000%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress

          // ─── BACKGROUND MORPHS ───
          // Pink: appears at 0.07, holds, fades out at 0.50
          const pinkIn = lerp(p, 0.07, 0.12)
          const pinkOut = lerp(p, 0.50, 0.55)
          if (pinkBgRef.current) {
            pinkBgRef.current.style.opacity = String(Math.max(0, pinkIn - pinkOut))
          }

          // Blue (electric): appears at 0.50, fades at 0.60
          const blueIn = lerp(p, 0.50, 0.55)
          const blueOut = lerp(p, 0.60, 0.65)
          if (blueBgRef.current) {
            blueBgRef.current.style.opacity = String(Math.max(0, blueIn - blueOut))
          }

          // Magenta: appears at 0.60, fades at 0.70
          const magentaIn = lerp(p, 0.60, 0.65)
          const magentaOut = lerp(p, 0.70, 0.75)
          if (magentaBgRef.current) {
            magentaBgRef.current.style.opacity = String(Math.max(0, magentaIn - magentaOut))
          }

          // Teal: appears at 0.70 and stays
          const tealIn = lerp(p, 0.70, 0.75)
          if (tealBgRef.current) {
            tealBgRef.current.style.opacity = String(tealIn)
          }

          // ─── HERO PHASE A: Beat 0 → Beat 1 (0.05 → 0.10) ───
          const pA = lerp(p, 0.05, 0.10)
          if (beat0Ref.current) {
            beat0Ref.current.style.transform = `translateY(${-pA * 100}%)`
            beat0Ref.current.style.opacity = String(1 - pA)
          }
          if (wordmarkRef.current) {
            wordmarkRef.current.style.transform = `translateY(${pA * 110}%)`
            wordmarkRef.current.style.opacity = String(1 - pA)
          }
          if (wordmarkTaglineRef.current) {
            wordmarkTaglineRef.current.style.transform = `translateY(${-pA * 60}px)`
            wordmarkTaglineRef.current.style.opacity = String(1 - pA)
          }
          if (beat1Ref.current) {
            beat1Ref.current.style.transform = `translateY(${(1 - pA) * 100}%)`
            beat1Ref.current.style.opacity = String(pA)
          }

          // ─── HERO PHASE B: services slide out + splash fades (0.15 → 0.22) ───
          const pB = lerp(p, 0.15, 0.22)
          if (leftColRef.current) {
            leftColRef.current.style.transform = `translateX(${-pB * 120}%)`
            leftColRef.current.style.opacity = String(1 - pB)
          }
          if (rightColRef.current) {
            rightColRef.current.style.transform = `translateX(${pB * 120}%)`
            rightColRef.current.style.opacity = String(1 - pB)
          }
          if (heroSplashRef.current) {
            heroSplashRef.current.style.opacity = String(0.9 * (1 - pB))
          }
          if (beat1Ref.current && pB > 0) {
  beat1Ref.current.style.opacity = String(1 - pB)
}

          // ─── VIDEO PHASE C: scale-grow + char reveal (0.22 → 0.32) ───
          const pC = lerp(p, 0.22, 0.32)
          const easedC = 1 - Math.pow(1 - pC, 3)
          if (revealCenterRef.current) {
            revealCenterRef.current.style.transform = `scale(${easedC})`
          }

          phraseCharsRef.current.forEach((char, i) => {
            if (!char) return
            const charDelay = i * 0.003
            const charStart = 0.25 + charDelay
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

          // ─── VIDEO PHASE E: Bento expansion (0.40 → 0.50) ───
          const pE = lerp(p, 0.40, 0.50)
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

          // ─── TRANSITION OUT OF VIDEO INTRO (0.48 → 0.55) ───
          // Bento + everything fades out as testimonials come in
          const pBentoOut = lerp(p, 0.48, 0.55)
          if (galleryRef.current) {
            galleryRef.current.style.opacity = String(1 - pBentoOut)
          }

          // ─── TESTIMONIALS PHASE A: Header reveal (0.52 → 0.58) ───
          const pTestHeader = lerp(p, 0.52, 0.58)
          if (testHeaderRef.current) {
            testHeaderRef.current.style.opacity = String(pTestHeader)
            testHeaderRef.current.style.transform = `translateY(${(1 - pTestHeader) * 30}px)`
          }

          testHeaderCharsRef.current.forEach((char, i) => {
            if (!char) return
            const charDelay = i * 0.003
            const charStart = 0.53 + charDelay
            const charProgress = lerp(p, charStart, charStart + 0.04)
            const baseOpacity = 0.15 + charProgress * 0.85
            char.style.opacity = String(baseOpacity)
          })

          // ─── TESTIMONIALS CARDS — driven by phase ───
          // Card 1: in at 0.58, fully visible 0.62, fades out 0.66
          // Card 2: in at 0.66, fully visible 0.70, fades out 0.74
          // Card 3: in at 0.74, fully visible 0.78, hold to end
          const cardPhases = [
            { in: 0.58, full: 0.62, out: 0.68, end: 0.72 },
            { in: 0.68, full: 0.72, out: 0.78, end: 0.82 },
            { in: 0.78, full: 0.82, out: 1.05, end: 1.10 }, // last card stays visible
          ]

          cardRefs.current.forEach((card, i) => {
  if (!card) return
  const phase = cardPhases[i]
  const inProgress = lerp(p, phase.in, phase.full)
  const outProgress = lerp(p, phase.out, phase.end)
  const visible = Math.max(0, inProgress - outProgress)

  card.style.opacity = String(visible)
  // Keep horizontal centering (-50%), animate vertical + scale only
  const y = (1 - inProgress) * 200 - outProgress * 120 // slide up in, slide up out
  const scale = 0.92 + inProgress * 0.08
  card.style.transform = `translateX(-50%) translateY(${y}px) scale(${scale})`
})

          // Header fades out when last card transitions in
          const pHeaderOut = lerp(p, 0.62, 0.68)
          if (testHeaderRef.current && pHeaderOut > 0) {
            const currentOp = parseFloat(testHeaderRef.current.style.opacity || '1')
            testHeaderRef.current.style.opacity = String(currentOp * (1 - pHeaderOut))
          }
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const wordmark = 'Splash Media'

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
      {/* ── BACKGROUND GRADIENT LAYERS ── */}
      {/* Pink — services + video intro */}
      <div
        ref={pinkBgRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0,
          zIndex: 1,
          willChange: 'opacity',
          background: `
            radial-gradient(circle at 20% 30%, #ec4899 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #f472b6 0%, transparent 55%),
            radial-gradient(circle at 60% 80%, #c026d3 0%, transparent 50%),
            radial-gradient(circle at 30% 70%, #be185d 0%, transparent 60%),
            linear-gradient(135deg, #500724 0%, #831843 50%, #4a044e 100%)
          `,
        }}
      />

      {/* Electric Blue — Thurl Bailey card */}
      <div
        ref={blueBgRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0,
          zIndex: 2,
          willChange: 'opacity',
          background: `
            radial-gradient(circle at 20% 30%, #3b82f6 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #60a5fa 0%, transparent 55%),
            radial-gradient(circle at 60% 80%, #1e40af 0%, transparent 50%),
            radial-gradient(circle at 30% 70%, #1d4ed8 0%, transparent 60%),
            linear-gradient(135deg, #0c1e3e 0%, #1e3a8a 50%, #1e1b4b 100%)
          `,
        }}
      />

      {/* Yellow — Marlene card */}
<div
  ref={magentaBgRef}
  aria-hidden
  className="pointer-events-none absolute inset-0"
  style={{
    opacity: 0,
    zIndex: 3,
    willChange: 'opacity',
    background: `
      radial-gradient(circle at 20% 30%, #f59e0b 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, #fbbf24 0%, transparent 55%),
      radial-gradient(circle at 60% 80%, #d97706 0%, transparent 50%),
      radial-gradient(circle at 30% 70%, #b45309 0%, transparent 60%),
      linear-gradient(135deg, #451a03 0%, #78350f 50%, #422006 100%)
    `,
  }}
/>

      {/* Teal — GFCBW card */}
      <div
        ref={tealBgRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0,
          zIndex: 4,
          willChange: 'opacity',
          background: `
            radial-gradient(circle at 20% 30%, #14b8a6 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #2dd4bf 0%, transparent 55%),
            radial-gradient(circle at 60% 80%, #0f766e 0%, transparent 50%),
            radial-gradient(circle at 30% 70%, #134e4a 0%, transparent 60%),
            linear-gradient(135deg, #042f2e 0%, #115e59 50%, #064e3b 100%)
          `,
        }}
      />

      {/* ─── HERO SPLASH VIDEO ─── */}
      <video
        ref={heroSplashRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 z-[5] h-full w-full object-cover"
        style={{ mixBlendMode: 'screen', opacity: 0.9 }}
      >
        <source src="/videos/ms.mp4" type="video/mp4" />
      </video>

      {/* ─── BEAT 0 — intro copy ─── */}
      {/* ─── BEAT 0 — intro copy ─── */}
<div ref={beat0Ref} className="absolute inset-0 z-[10]" style={{ pointerEvents: 'none' }}>
<div
  className="absolute left-16 top-40 max-w-sm text-left md:left-24 md:top-48 lg:left-32"
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

        </div>
      </div>

      {/* ─── BEAT 1 — services 2x2 ─── */}
      <div ref={beat1Ref} className="absolute inset-0 z-[10]" style={{ pointerEvents: 'none' }}>
        <div
          className="relative grid h-full w-full grid-cols-1 items-stretch px-6 pt-20 pb-24 md:grid-cols-2 md:px-12 md:pt-24 md:pb-28 lg:px-20"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="absolute left-1/2 top-32 z-10 -translate-x-1/2 md:top-40">
            <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.4em] text-white/70 md:text-[11px]">
              <span className="inline-block h-px w-8 bg-white/40" />
              What We Do
              <span className="inline-block h-px w-8 bg-white/40" />
            </div>
          </div>

          <div ref={leftColRef} className="flex flex-col justify-center gap-12 pr-0 md:gap-16 md:pr-12 lg:pr-16">
            <ServiceCard service={services[0]} align="left" />
            <ServiceCard service={services[1]} align="left" />
          </div>

          {/* Center divider */}
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
            <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '20%', width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.5)' }} />
            <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '80%', width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.5)' }} />
          </div>

          <div ref={rightColRef} className="flex flex-col justify-center gap-12 pl-0 md:gap-16 md:pl-12 lg:pl-16">
            <ServiceCard service={services[2]} align="right" />
            <ServiceCard service={services[3]} align="right" />
          </div>
        </div>
      </div>

      {/* ─── PREMIUM TAGLINE ─── */}<p
  ref={wordmarkTaglineRef}
  className="pointer-events-none absolute bottom-[42%] left-0 right-0 z-[10] text-center md:bottom-[40%]"
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

      {/* ─── SPLASH MEDIA WORDMARK ─── */}
      <h1
        ref={wordmarkRef}
        className="splash-wordmark absolute bottom-0 left-0 right-0 z-[10] select-none px-4 pb-24 text-center leading-[0.95] md:pb-24"
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

      {/* ─── VIDEO INTRO PHRASE ─── */}
      <p
        className="absolute left-1/2 z-[20] -translate-x-1/2 px-6 text-center"
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
              if (el) phraseCharsRef.current[i] = el
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

      {/* ─── ABOUT US CTA ─── */}
      <div className="absolute bottom-[8%] left-1/2 z-[20] -translate-x-1/2">
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

      {/* ─── TESTIMONIALS HEADER ─── */}
      <div
        ref={testHeaderRef}
        className="absolute inset-x-0 top-[15%] z-[20] px-6 text-center"
        style={{ opacity: 0 }}
      >
        <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.4em] text-white/70 md:text-[11px]">
          <span className="inline-block h-px w-8 align-middle bg-white/40 mr-3" />
          Testimonials
          <span className="inline-block h-px w-8 align-middle bg-white/40 ml-3" />
        </p>
        <h2
          className="mx-auto max-w-5xl text-balance leading-[1.05] text-white"
          style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: 'clamp(2rem, 4vw, 4.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          {'What our partners say about working with us.'.split('').map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) testHeaderCharsRef.current[i] = el
              }}
              style={{
                display: 'inline-block',
                whiteSpace: char === ' ' ? 'pre' : 'normal',
                opacity: 0.15,
              }}
            >
              {char}
            </span>
          ))}
        </h2>
      </div>

      {/* ─── TESTIMONIAL CARDS ─── */}
      {testimonials.map((t, i) => (
        <TestimonialCard
          key={i}
          testimonial={t}
          total={testimonials.length}
          cardRef={(el) => {
            cardRefs.current[i] = el
          }}
        />
      ))}

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

// ─────────────────────────────────────────────
// SUB-COMPONENT: TESTIMONIAL CARD
// ─────────────────────────────────────────────
function TestimonialCard({
  testimonial,
  total,
  cardRef,
}: {
  testimonial: Testimonial
  total: number
  cardRef: (el: HTMLDivElement | null) => void
}) {
  return (
    <div
      ref={cardRef}
      className="absolute left-1/2 top-[42%] z-[25] w-[92%] max-w-5xl -translate-x-1/2 overflow-hidden rounded-3xl border border-white/10 px-8 py-12 backdrop-blur-md md:px-14 md:py-16"
      style={{
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
        boxShadow:
          '0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.10)',
        opacity: 0,
      }}
    >
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
        <div>
          <span
            aria-hidden
            className="block text-[6rem] leading-none"
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              color: testimonial.accent,
              opacity: 0.7,
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