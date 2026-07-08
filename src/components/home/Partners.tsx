'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Partners.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const PARTNER_LOGOS = [
  '/images/partners/partner-01.png',
  '/images/partners/partner-02.png',
  '/images/partners/partner-03.png',
  '/images/partners/partner-04.png',
  '/images/partners/partner-05.png',
  '/images/partners/partner-06.png',
  '/images/partners/partner-07.png',
  '/images/partners/partner-08.png',
  '/images/partners/partner-09.png',
  '/images/partners/partner-10.png',
]

// Split into two marquee rows
const ROW_1 = PARTNER_LOGOS.slice(0, 5)
const ROW_2 = PARTNER_LOGOS.slice(5, 10)

const AWARD_LOGOS = [
  '/images/awards/award-01.jpg',
  '/images/awards/award-01.jpg',
  '/images/awards/award-01.jpg',
  '/images/awards/award-01.jpg',
  '/images/awards/award-01.jpg',
]

function AwardsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const slides = Array.from(track.children) as HTMLElement[]
    if (slides.length === 0) return

    gsap.set(slides, { opacity: 0, scale: 0.8 })
    gsap.set(slides[0], { opacity: 1, scale: 1 })

    const interval = setInterval(() => {
      const current = indexRef.current
      const next = (current + 1) % slides.length
      gsap.to(slides[current], { opacity: 0, scale: 0.8, duration: 0.5, ease: 'power2.inOut' })
      gsap.to(slides[next], { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.inOut' })
      indexRef.current = next
    }, 2200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.awardsCarousel}>
      <div ref={trackRef} className={styles.awardsTrack}>
        {AWARD_LOGOS.map((src, i) => (
          <div key={i} className={styles.awardSlide}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className={styles.awardLogo} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Partners() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(`.${styles.section}`)
      // don't pin the last one
      panels.pop()

      panels.forEach((panel) => {
        const innerpanel = panel.querySelector<HTMLElement>(`.${styles.sectionInner}`)
        if (!innerpanel) return

        const panelHeight = innerpanel.offsetHeight
        const windowHeight = window.innerHeight
        const difference = panelHeight - windowHeight
        const fakeScrollRatio = difference > 0 ? difference / (difference + windowHeight) : 0

        if (fakeScrollRatio) {
          panel.style.marginBottom = panelHeight * fakeScrollRatio + 'px'
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'bottom bottom',
            end: () => (fakeScrollRatio ? `+=${innerpanel.offsetHeight}` : 'bottom top'),
            pinSpacing: false,
            pin: true,
            scrub: true,
          },
        })

        if (fakeScrollRatio) {
          tl.to(innerpanel, {
            yPercent: -100,
            y: window.innerHeight,
            duration: 1 / (1 - fakeScrollRatio) - 1,
            ease: 'none',
          })
        }
        tl.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.7, opacity: 0.5, duration: 0.9 }).to(
          panel,
          { opacity: 0, duration: 0.1 }
        )
      })
    }, wrapper)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapperRef} className={styles.slidesWrapper}>
      {/* ─── CARD 1 — Awards ─── */}
      <section className={`${styles.section} ${styles.card1}`}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionInner}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              Recognition
              <span className={styles.eyebrowLine} />
            </p>

            <div className={styles.blockGroup}>
              <h3 className={styles.blockHeading}>Awards</h3>
              <AwardsCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CARD 2 — Community Engagement (video bg) ─── */}
      <section className={`${styles.section} ${styles.card2}`}>
        {/* Full video background */}
        <video
          className={styles.card2Video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        >
          <source src="/videos/community.mp4" type="video/mp4" />
        </video>
        <div className={styles.card2Overlay} aria-hidden />

        <div className={styles.sectionContent}>
          <div className={styles.sectionInner}>
            <div className={styles.card2Layout}>
              {/* Bottom-left: tag + title + subtitle */}
              <div className={styles.card2Left}>
                <span className={styles.card2Tag}>Community</span>
                <h2 className={styles.card2Title}>
                  Community
                  <br />
                  Engagement
                </h2>
                <p className={styles.card2Sub}>
                  Splash Media knows the importance of community involvement.
                </p>
              </div>

              {/* Bottom-right: explore button */}
              <a href="/events" className={styles.card2Explore}>
                <span className={styles.card2ExploreLabel}>View All Events</span>
                <span className={styles.card2ExploreArrow} aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CARD 3 — Partnerships ─── */}
      <section className={`${styles.section} ${styles.card3}`}>
        <div className={styles.sectionContent}>
          <div className={`${styles.sectionInner} ${styles.partnersInner}`}>
            <div className={styles.partnersHead}>
              <h2 className={styles.partnersTitle}>Partnerships</h2>
              <p className={styles.partnersSub}>
                We partner and work with the biggest brands in our Utah community.
              </p>
            </div>

            <div className={styles.marqueeWrap}>
              {/* Row 1 — scrolls left */}
              <div className={styles.marquee}>
                <div className={styles.marqueeGroup}>
                  {ROW_1.map((src, i) => (
                    <div key={`a-${i}`} className={styles.logoCell}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className={styles.partnerLogo} />
                    </div>
                  ))}
                </div>
                <div className={styles.marqueeGroup} aria-hidden>
                  {ROW_1.map((src, i) => (
                    <div key={`b-${i}`} className={styles.logoCell}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className={styles.partnerLogo} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 2 — scrolls right (reverse) */}
              <div className={`${styles.marquee} ${styles.marqueeReverse}`}>
                <div className={styles.marqueeGroup}>
                  {ROW_2.map((src, i) => (
                    <div key={`c-${i}`} className={styles.logoCell}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className={styles.partnerLogo} />
                    </div>
                  ))}
                </div>
                <div className={styles.marqueeGroup} aria-hidden>
                  {ROW_2.map((src, i) => (
                    <div key={`d-${i}`} className={styles.logoCell}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className={styles.partnerLogo} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}