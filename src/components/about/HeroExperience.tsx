'use client'

import { useEffect, useRef } from 'react'
import SplashButton from '@/components/layout/SplashButton'
import styles from './HeroExperience.module.css'

export default function HeroExperience() {
  const boundRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const passionRef = useRef<HTMLDivElement>(null)
  const passionTitleRef = useRef<HTMLDivElement>(null)
  const passionBodyRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bound = boundRef.current
    const video = videoRef.current
    if (!bound || !video) return

    // ─── TWEAKABLE KNOBS ─────────────────────────────────
    // Start scrolling pixel where video begins scrubbing (0 = first pixel)
    // 0 = video starts on first scroll pixel
    // 0.15 = wait 15% of scroll before video starts (title can sit longer)
    const START_DELAY = 0

    // Trim the video's scrubbable range:
    // START_VIDEO_AT = seconds into the video where scrubbing BEGINS
    //   (0 = start from frame 0, 1.0 = skip first second so video looks "already moving")
    // END_VIDEO_AT = seconds where scrubbing ENDS
    //   (set to video.duration for full clip, or less to stop early)
    const START_VIDEO_AT = 1.0
    const END_VIDEO_AT = 7.0

    // Lerp catch-up rate
    const SMOOTH = 0.25
    // ─────────────────────────────────────────────────────

    let rafId: number
    let ready = false
    let smoothedTime = 1.0 // will be set to START_VIDEO_AT once ready

    const handleReady = () => {
      ready = true
      video.pause()
      smoothedTime = START_VIDEO_AT
      video.currentTime = START_VIDEO_AT
      console.log('[video] ready, duration:', video.duration)
    }

    // Listen for when metadata is loaded
    if (video.readyState >= 1 && video.duration > 0) {
      handleReady()
    } else {
      video.addEventListener('loadedmetadata', handleReady, { once: true })
    }

    // Force load
    video.load()

    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
    const ramp = (val: number, from: number, to: number) =>
      clamp01((val - from) / (to - from))

    const tick = () => {
      if (ready && video.duration > 0) {
        const rect = bound.getBoundingClientRect()
        const scrolled = -rect.top
        const maxScroll = rect.height - window.innerHeight
        let p = scrolled / maxScroll
        if (p < 0) p = 0
        if (p > 1) p = 1

        // Apply start delay if any
        let videoProgress = p
        if (START_DELAY > 0) {
          videoProgress = p > START_DELAY ? (p - START_DELAY) / (1 - START_DELAY) : 0
        }

        // Map progress (0–1) onto the trimmed range [START_VIDEO_AT, END_VIDEO_AT]
        const target = START_VIDEO_AT + videoProgress * (END_VIDEO_AT - START_VIDEO_AT)

        // Smooth the time toward target (lerp)
        smoothedTime += (target - smoothedTime) * SMOOTH

        if (Math.abs(video.currentTime - smoothedTime) > 0.02) {
          try {
            video.currentTime = smoothedTime
          } catch (e) {
            console.warn('seek error', e)
          }
        }

        // ── Stage transitions ───────────────────────────────
        // ── TITLE: stays at full size, then shrinks out (no fade) ──
        if (titleRef.current) {
          // Shrink 1.0 → 0.3 between 0.10 → 0.20
          const shrink = ramp(p, 0.10, 0.20)
          const scale = 1 - shrink * 0.7
          // Keep visible during shrink, then hide after fully shrunk
          const o = shrink >= 1 ? 0 : 1
          titleRef.current.style.opacity = String(o)
          titleRef.current.style.transform = `scale(${scale})`
        }

        // ── PASSION: title and body slide in together, then exit in different directions ──
        if (passionRef.current) {
          // Slide in: 0.18 → 0.28
          const slideIn = ramp(p, 0.18, 0.28)
          // Exit: 0.40 → 0.50
          const exit = ramp(p, 0.40, 0.50)

          // Container handles initial slide-in
          const slideY = (1 - slideIn) * 100
          const o = exit >= 1 ? 0 : slideIn
          passionRef.current.style.opacity = String(o)
          passionRef.current.style.transform = `translateY(${slideY}%)`
          passionRef.current.style.pointerEvents = o > 0.5 && exit < 0.5 ? 'auto' : 'none'

          // Title exits UP
          if (passionTitleRef.current) {
            const exitY = exit * -120
            passionTitleRef.current.style.transform = `translateY(${exitY}%)`
          }

          // Body + button exits UP
          if (passionBodyRef.current) {
            const exitY = exit * -120
            passionBodyRef.current.style.transform = `translateY(${exitY}%)`
          }
        }

        // ── MISSION: slides up from bottom into final spot ──
        if (missionRef.current) {
          const slideIn = ramp(p, 0.55, 0.68)
          const slideY = (1 - slideIn) * 100
          missionRef.current.style.opacity = String(slideIn)
          missionRef.current.style.transform = `translateY(${slideY}%)`
          missionRef.current.style.pointerEvents = slideIn > 0.5 ? 'auto' : 'none'
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafId)
      video.removeEventListener('loadedmetadata', handleReady)
    }
  }, [])

  return (
    <div ref={boundRef} className={styles.bound}>
      <div className={styles.sticky}>
        <div className={styles.bg} aria-hidden />
        <video
          ref={videoRef}
          className={styles.video}
          src="/videos/about.mp4"
          muted
          playsInline
          preload="auto"
        />

        {/* Title overlay */}
        <div ref={titleRef} className={styles.titleOverlay}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            Splash Media
            <span className={styles.eyebrowLine} />
          </p>
          <h1 className={styles.titleBig}>About Us</h1>
        </div>

        {/* Passion content — Blackbird-style layout: title top-left, body+CTA bottom-right */}
        <div ref={passionRef} className={styles.passion}>
          <div ref={passionTitleRef} className={styles.passionTitleWrap}>
            <p className={styles.passionEyebrow}>02 / Who We Are</p>
            <h2 className={styles.passionTitle}>
              Driven by <span className={styles.passionAccent}>passion</span>,
              dedication, and diligence.
            </h2>
          </div>

          <div ref={passionBodyRef} className={styles.passionBodyWrap}>
            <p className={styles.passionText}>
              Our foundation is built on a deep-seated passion for marketing,
              unwavering commitment to our craft, and relentless hard work. We
              believe in going the extra mile — not just to meet, but to exceed
              expectations.
            </p>
            <div className={styles.buttonWrap}>
              <SplashButton color="neutral" size="md" href="/contact">
                Schedule a Consultation
              </SplashButton>
            </div>
          </div>
        </div>

        {/* Mission / Reputation — third section */}
        <div ref={missionRef} className={styles.mission}>
          <div className={styles.missionGrid}>
            <div className={styles.missionBlock}>
              <p className={styles.missionLabel}>01 / Our Mission</p>
              <h3 className={styles.missionTitle}>What drives us forward.</h3>
              <p className={styles.missionText}>
                Helping businesses grow through data-driven marketing, creative
                storytelling, and results-focused strategy.
              </p>
            </div>
            <div className={styles.missionBlock}>
              <p className={styles.missionLabel}>02 / Our Reputation</p>
              <h3 className={styles.missionTitle}>Trusted across industries.</h3>
              <p className={styles.missionText}>
                Trusted by brands across industries to deliver impactful
                campaigns across TV, radio, digital, and social platforms.
              </p>
            </div>
          </div>
          <div className={styles.buttonWrap}>
            <SplashButton color="neutral" size="md" href="/contact">
              Schedule a Consultation
            </SplashButton>
          </div>
        </div>
      </div>
    </div>
  )
}