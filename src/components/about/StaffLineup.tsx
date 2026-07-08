'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './StaffLineup.module.css'

const STAFF = [
  { img: '/images/about/staff1.png', name: 'Staff Member' },
  { img: '/images/about/staff2.png', name: 'Staff Member' },
  { img: '/images/about/staff3.png', name: 'Staff Member' },
  { img: '/images/about/staff4.png', name: 'Staff Member' },
  { img: '/images/about/staff5.png', name: 'Staff Member' },
  { img: '/images/about/staff6.png', name: 'Staff Member' },
]

export default function StaffLineup() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add(styles.visible)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.lineup}>
        {STAFF.map((person, i) => (
          <a
            key={i}
            href="/team"
            className={styles.card}
            style={{ '--delay': `${i * 0.08}s` } as React.CSSProperties}
            aria-label={`Meet ${person.name}`}
          >
            <div className={styles.imageWrap}>
              <Image
                src={person.img}
                alt={person.name}
                fill
                className={styles.image}
                sizes="17vw"
                priority={i < 3}
              />
            </div>

            <div className={styles.hoverOverlay} aria-hidden>
              <div className={styles.hoverContent}>
                <span className={styles.hoverLabel}>Meet Our Staff</span>
                <span className={styles.hoverArrow}>→</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}