'use client'

import Link from 'next/link'
import SplashButton from './SplashButton'
import styles from './Footer.module.css'

const menuLinks = [
  { label: 'Home', href: '/' },
  { label: 'Our Work', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
]

// Social icons (inline SVG, currentColor)
const socials = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 9.5H5.67V18h2.67V9.5zM7 5.88a1.54 1.54 0 1 0 0 3.08 1.54 1.54 0 0 0 0-3.08zM18.33 18v-4.66c0-2.49-1.33-3.65-3.1-3.65a2.67 2.67 0 0 0-2.42 1.33h-.04V9.5h-2.56V18h2.67v-4.2c0-1.11.21-2.18 1.58-2.18 1.35 0 1.37 1.26 1.37 2.25V18h2.5z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1 0-5.18c.27 0 .53.04.77.12v-3.2a5.7 5.7 0 0 0-.77-.05A5.73 5.73 0 0 0 9.86 21a5.73 5.73 0 0 0 5.68-5.73V9.01a7.34 7.34 0 0 0 4.29 1.37V7.3a4.28 4.28 0 0 1-3.23-1.48z" />
      </svg>
    ),
  },
  {
    label: 'Threads',
    href: 'https://threads.net',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.3 11.2c-.1 0-.2-.1-.3-.1-.2-3-1.8-4.7-4.5-4.7-1.6 0-3 .7-3.8 2l1.5 1c.6-.9 1.5-1.1 2.3-1.1 1.5 0 2.3.9 2.4 2.3-.7-.1-1.4-.2-2.2-.1-2.3.1-3.8 1.5-3.7 3.4.1 1 .6 1.8 1.4 2.3.7.5 1.6.7 2.5.6 1.3-.1 2.2-.6 2.9-1.5.5-.7.8-1.5.9-2.6.6.4 1.1.9 1.3 1.6.4 1 .4 2.7-.9 4-1.2 1.1-2.5 1.6-4.5 1.6-2.2 0-3.9-.7-5-2.1C6.5 16 6 14.2 6 12s.5-4 1.5-5.3C8.6 5.3 10.3 4.6 12.5 4.6c2.2 0 3.9.7 5 2.1.6.7 1 1.6 1.3 2.6l1.8-.5c-.3-1.3-.9-2.4-1.7-3.3C19.4 3.5 17.3 2.6 14.5 2.6h-2C9.7 2.6 7.6 3.5 6.2 5.2 5 6.7 4.3 8.9 4.3 11.9v.2c0 3 .7 5.2 1.9 6.7 1.4 1.7 3.5 2.6 6.3 2.6h.1c2.4 0 4.1-.7 5.5-2 1.8-1.7 1.7-3.9 1.2-5.3-.4-1-1.1-1.8-2-2.4zm-4.4 4.6c-1 .1-2-.4-2.1-1.3 0-.7.5-1.4 2-1.5h.6c.5 0 1 0 1.4.1-.2 2-1.1 2.6-1.9 2.7z" />
      </svg>
    ),
  },
]

const wordmark = 'We Are Splash Media'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* ── WAVE SEPARATOR at the very top ── */}
      <div className={styles.waveTop} aria-hidden>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,38
               C200,8 360,2 540,28
               C700,52 800,72 960,66
               C1120,60 1280,20 1440,12
               L1440,80 L0,80 Z"
            fill="#1e6fc4"
          />
        </svg>
      </div>

      <div className={styles.footerBody}>
        {/* floating droplets */}
        <span className={styles.droplet} style={{ width: 14, height: 14, top: 30, left: '18%' }} />
        <span className={styles.droplet} style={{ width: 9, height: 9, top: 60, left: '42%' }} />
        <span className={styles.droplet} style={{ width: 18, height: 18, top: 20, left: '73%' }} />
        <span className={styles.droplet} style={{ width: 7, height: 7, top: 70, left: '88%' }} />

        {/* ── COLUMNS ── */}
        <div className={styles.inner}>
        {/* LEFT — menu */}
        <nav className={styles.colLeft}>
          <p className={styles.colHeading}>Navigation</p>
          {menuLinks.map((l) => (
            <Link key={l.label} href={l.href} className={styles.menuLink}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CENTER — CTA */}
        <div className={styles.colCenter}>
          <h3 className={styles.ctaTitle}>Let&apos;s make a splash.</h3>
          <p className={styles.ctaSub}>
            Ready to elevate your brand? Let&apos;s talk about what we can build together.
          </p>
          <SplashButton color="neutral" size="md" href="/contact">
            Book Consultation
          </SplashButton>
        </div>

        {/* RIGHT — social */}
        <div className={styles.colRight}>
          <p className={styles.colHeading}>Let&apos;s Socialize</p>
          <div className={styles.socialRow}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
          <p className={styles.copyright}>© 2026 Splash Media</p>
        </div>
      </div>

        {/* ── GIANT WORDMARK ── */}
        <div className={styles.wordmarkWrap}>
          <h2 className={styles.wordmark}>{wordmark}</h2>
        </div>
      </div>
    </footer>
  )
}