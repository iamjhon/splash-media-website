'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './ServicesRoulette.module.css'

type Service = {
  label: string
  href: string
  image: string
  sub: string[]
}

const SERVICES: Service[] = [
  {
    label: 'Marketing',
    href: '/services/marketing',
    image: '/images/services/marketing.jpg',
    sub: ['Radio Ads', 'TV Ads', 'Branding', 'Graphic Design'],
  },
  {
    label: 'Ad Campaigns',
    href: '/services/ad-campaigns',
    image: '/images/services/ad-campaigns.jpg',
    sub: ['Google Ads', 'Social Media Ads', 'LinkedIn Campaigns'],
  },
  {
    label: 'Web Design',
    href: '/services/web-development',
    image: '/images/services/web-design.jpg',
    sub: ['Wordpress', 'Custom Development', 'Maintenance'],
  },
  {
    label: 'Print',
    href: '/services/print',
    image: '/images/services/print.jpg',
    sub: ['Promotionals', 'Graphics', 'Stationary', 'Apparel'],
  },
]

export default function ServicesRoulette() {
  const router = useRouter()
  const listRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [visible, setVisible] = useState(false)

  // Staggered entrance via IntersectionObserver
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div
        ref={listRef}
        className={`${styles.list} ${visible ? styles.visible : ''} ${hovered !== null ? styles.dimmed : ''}`}
      >
        {/* What We Do — right above Marketing */}
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          What We Do
        </div>

        {SERVICES.map((s, i) => (
          <div
            key={s.label}
            className={styles.item}
            style={{ '--i': i } as React.CSSProperties}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => router.push(s.href)}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') router.push(s.href)
            }}
          >
            {/* Background image, revealed on hover (driven by React state) */}
            <div
              className={`${styles.itemBg} ${hovered === i ? styles.itemBgActive : ''}`}
              style={{
                backgroundImage: `url("${s.image}")`,
              }}
              aria-hidden
            />
            <div className={styles.itemContent}>
              <div className={styles.itemHead}>
                <span className={styles.index}>0{i + 1}</span>
                <span className={styles.label}>{s.label}</span>
                <span className={styles.arrow} aria-hidden>↗</span>
              </div>
              <div className={styles.subRow}>
                {s.sub.map((item) => (
                  <span key={item} className={styles.sub}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}