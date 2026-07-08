'use client'

import { useEffect, useRef } from 'react'
import styles from './GradientBlobBg.module.css'

/**
 * GradientBlobBg — animated gradient "metaball" background using an SVG goo
 * filter. Five slowly-drifting colored blobs plus one interactive blob that
 * eases toward the cursor. Fills its (position:relative) parent.
 */
export default function GradientBlobBg() {
  const interRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interBubble = interRef.current
    if (!interBubble) return

    let curX = 0
    let curY = 0
    let tgX = 0
    let tgY = 0
    let raf = 0

    const move = () => {
      curX += (tgX - curX) / 20
      curY += (tgY - curY) / 20
      interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`
      raf = requestAnimationFrame(move)
    }

    const onMove = (e: MouseEvent) => {
      const rect = interBubble.parentElement?.getBoundingClientRect()
      tgX = e.clientX - (rect?.left ?? 0)
      tgY = e.clientY - (rect?.top ?? 0)
    }

    window.addEventListener('mousemove', onMove)
    move()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div className={styles.gradientBg} aria-hidden>
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={styles.gradientsContainer}>
        <div className={styles.g1} />
        <div className={styles.g2} />
        <div className={styles.g3} />
        <div className={styles.g4} />
        <div className={styles.g5} />
        <div ref={interRef} className={styles.interactive} />
      </div>
    </div>
  )
}