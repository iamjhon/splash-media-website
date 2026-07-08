'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Navbar.module.css'

// ─────────────────────────────────────────────
// NAV STRUCTURE
// ─────────────────────────────────────────────
type SubItem = { label: string; href: string }
type NavItem = {
  label: string
  href: string
  sub?: SubItem[]
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    sub: [
      { label: 'Marketing', href: '/services/marketing' },
      { label: 'Ad Campaigns', href: '/services/ad-campaigns' },
      { label: 'Web Development', href: '/services/web-development' },
      { label: 'Print', href: '/services/print' },
    ],
  },
  { label: 'Portfolio', href: '/portfolio' },
  {
    label: 'About',
    href: '/about',
    sub: [
      { label: 'Who We Are', href: '/about' },
      { label: 'Our Team', href: '/about/team' },
      { label: 'Community Engagement', href: '/about/community' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header className={`${styles.navRoot} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          {/* ─── LOGO (left) ─── */}
          <Link href="/" className={styles.navLogo} aria-label="Splash Media home">
            <Image
              src="/images/logo.png"
              alt="Splash Media"
              width={500}
              height={440}
              priority
              style={{ height: 'auto', width: 'auto', maxHeight: '90px', objectFit: 'contain' }}
            />
          </Link>

          {/* ─── RIGHT: MENU button + Contact icon ─── */}
          <div className={styles.navRight}>
            {/* Contact icon button */}
            <Link href="/contact" className={styles.contactBtn} aria-label="Contact us">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </Link>

            {/* MENU toggle button */}
            <button
              className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnOpen : ''}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              <span className={styles.menuBtnText}>
                {menuOpen ? 'CLOSE' : 'MENU'}
              </span>
              <span className={styles.menuBtnIcon}>
                <span className={styles.menuLine} />
                <span className={styles.menuLine} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── FULL OVERLAY MENU ─── */}
      <div className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`}>
        <div className={styles.overlayInner}>
          <nav className={styles.overlayNav}>
            {navItems.map((item, i) => (
              <div
                key={item.label}
                className={styles.overlayGroup}
                style={{ '--i': i } as React.CSSProperties}
              >
                <Link
                  href={item.href}
                  className={styles.overlayLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.sub && (
                  <div className={styles.overlaySub}>
                    {item.sub.map((s) => (
                      <Link
                        key={s.label}
                        href={s.href}
                        className={styles.overlaySublink}
                        onClick={() => setMenuOpen(false)}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer: email + socials */}
          <div className={styles.overlayFooter}>
            <a href="mailto:hello@splashmedia.com" className={styles.overlayEmail}>
              hello@splashmedia.com
            </a>
            <div className={styles.overlaySocials}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.overlaySocialLink}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}