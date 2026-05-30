'use client'

import Link from 'next/link'
import { type ReactNode, type CSSProperties } from 'react'
import styles from './SplashButton.module.css'

// ─────────────────────────────────────────────
// COLOR VARIANTS
// Each variant sets the flowing border colors + hover glow via
// CSS custom properties injected as inline style.
// ─────────────────────────────────────────────
type Variant = 'blue' | 'red' | 'yellow' | 'green' | 'purple' | 'neutral'

const variantVars: Record<Variant, CSSProperties> = {
  blue: {
    ['--border-grad' as string]:
      'rgba(255,255,255,0.45), rgba(59,130,246,0.45), rgba(14,165,233,0.45), rgba(96,165,250,0.45), rgba(255,255,255,0.45)',
    ['--glow1' as string]: 'rgba(59,130,246,0.35)',
    ['--glow2' as string]: 'rgba(14,165,233,0.25)',
  },
  red: {
    ['--border-grad' as string]:
      'rgba(255,255,255,0.45), rgba(239,68,68,0.45), rgba(244,63,94,0.45), rgba(248,113,113,0.45), rgba(255,255,255,0.45)',
    ['--glow1' as string]: 'rgba(239,68,68,0.35)',
    ['--glow2' as string]: 'rgba(244,63,94,0.25)',
  },
  yellow: {
    ['--border-grad' as string]:
      'rgba(255,255,255,0.45), rgba(245,158,11,0.45), rgba(251,191,36,0.45), rgba(253,224,71,0.45), rgba(255,255,255,0.45)',
    ['--glow1' as string]: 'rgba(245,158,11,0.35)',
    ['--glow2' as string]: 'rgba(251,191,36,0.25)',
  },
  green: {
    ['--border-grad' as string]:
      'rgba(255,255,255,0.45), rgba(34,197,94,0.45), rgba(16,185,129,0.45), rgba(74,222,128,0.45), rgba(255,255,255,0.45)',
    ['--glow1' as string]: 'rgba(34,197,94,0.35)',
    ['--glow2' as string]: 'rgba(16,185,129,0.25)',
  },
  purple: {
    ['--border-grad' as string]:
      'rgba(255,255,255,0.45), rgba(138,43,226,0.45), rgba(0,191,255,0.45), rgba(255,105,180,0.45), rgba(255,255,255,0.45)',
    ['--glow1' as string]: 'rgba(138,43,226,0.35)',
    ['--glow2' as string]: 'rgba(0,191,255,0.25)',
  },
  neutral: {
    ['--border-grad' as string]:
      'rgba(255,255,255,0.5), rgba(255,255,255,0.2), rgba(255,255,255,0.5), rgba(255,255,255,0.2), rgba(255,255,255,0.5)',
    ['--glow1' as string]: 'rgba(255,255,255,0.2)',
    ['--glow2' as string]: 'rgba(255,255,255,0.12)',
  },
}

type Size = 'sm' | 'md' | 'lg'

const sizeClass: Record<Size, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

// ─────────────────────────────────────────────
type SplashButtonProps = {
  children: ReactNode
  color?: Variant
  size?: Size
  href?: string
  onClick?: () => void
  icon?: ReactNode
  type?: 'button' | 'submit'
  fullWidth?: boolean
  className?: string
  style?: CSSProperties
}

export default function SplashButton({
  children,
  color = 'blue',
  size = 'md',
  href,
  onClick,
  icon,
  type = 'button',
  fullWidth = false,
  className = '',
  style,
}: SplashButtonProps) {
  const rootClass = `${styles.glassButton} ${sizeClass[size]} ${
    fullWidth ? styles.fullWidth : ''
  } ${className}`

  const mergedStyle = { ...variantVars[color], ...style }

  // Cursor-following radial highlight
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)) * 100
    e.currentTarget.style.setProperty('--x', `${x}%`)
    e.currentTarget.style.setProperty('--y', `${y}%`)
  }

  const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--x', '50%')
    e.currentTarget.style.setProperty('--y', '50%')
  }

  const content = (
    <>
      <span className={styles.label}>
        {children}
        {icon && <span className={styles.icon}>{icon}</span>}
      </span>
      <span className={styles.shimmer} aria-hidden />
    </>
  )

  const handlers = {
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
    onClick,
  }

  if (href) {
    return (
      <Link href={href} className={rootClass} style={mergedStyle} {...handlers}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={rootClass} style={mergedStyle} {...handlers}>
      {content}
    </button>
  )
}