'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SplashButton from './SplashButton'
import styles from './Navbar.module.css'

// ─────────────────────────────────────────────
// NAV STRUCTURE
// ─────────────────────────────────────────────
type SubItem = { label: string; href: string; desc?: string }
type NavItem = {
  label: string
  href: string
  mega?: { heading: string; items: SubItem[] }
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    mega: {
      heading: 'What we do',
      items: [
        { label: 'Marketing', href: '/services/marketing', desc: 'TV, radio, social, SEO' },
        { label: 'Ad Campaigns', href: '/services/ad-campaigns', desc: 'Strategy that converts' },
        { label: 'Web Development', href: '/services/web-development', desc: 'Sites built to perform' },
        { label: 'Print', href: '/services/print', desc: 'Tactile brand experiences' },
      ],
    },
  },
  { label: 'Portfolio', href: '/portfolio' },
  {
    label: 'About',
    href: '/about',
    mega: {
      heading: 'Who we are',
      items: [
        { label: 'Who We Are', href: '/about', desc: 'Our story & mission' },
        { label: 'Our Team', href: '/about/team', desc: 'The people behind the work' },
        { label: 'Community Engagement', href: '/about/community', desc: 'Giving back to Utah' },
      ],
    },
  },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [openMega, setOpenMega] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

const [hidden, setHidden] = useState(false)

useEffect(() => {
  const onScroll = () => {
    const y = window.scrollY
    const vh = window.innerHeight
    setScrolled(y > 20)
    // Hide the navbar once we scroll past ~2.1 viewports (into VideoIntro)
    setHidden(y > vh * 2.1)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <header className={`${styles.navRoot} ${scrolled ? styles.navScrolled : ''} ${hidden ? styles.navHidden : ''}`}>
        <div className={styles.navInner}>
          {/* ─── LOGO ─── */}
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

          {/* ─── CENTER NAV (desktop) ─── */}
          <nav className={styles.navCenter} onMouseLeave={() => setOpenMega(null)}>
            {navItems.map((item) => (
              <div
                key={item.label}
                className={styles.navItemWrap}
                onMouseEnter={() => setOpenMega(item.mega ? item.label : null)}
              >
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                  {item.mega && (
                    <span
                      className={`${styles.navCaret} ${
                        openMega === item.label ? styles.navCaretOpen : ''
                      }`}
                    >
                      ▾
                    </span>
                  )}
                </Link>

                {/* MEGA MENU */}
                {item.mega && (
                  <div
                    className={`${styles.mega} ${
                      openMega === item.label ? styles.megaOpen : ''
                    }`}
                  >
                    <div className={styles.megaPanel}>
                      <p className={styles.megaHeading}>{item.mega.heading}</p>
                      <div className={styles.megaGrid}>
                        {item.mega.items.map((sub) => (
                          <Link key={sub.label} href={sub.href} className={styles.megaItem}>
                            <span className={styles.megaItemLabel}>{sub.label}</span>
                            {sub.desc && <span className={styles.megaItemDesc}>{sub.desc}</span>}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ─── RIGHT: CTA BUTTON (desktop) ─── */}
          <div className={styles.navCta}>
            <SplashButton color="neutral" size="md" href="/contact">
              Free Consultation
            </SplashButton>
          </div>

          {/* ─── MOBILE HAMBURGER ─── */}
          <button
            className={styles.navBurger}
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span
              className={`${styles.burgerLine} ${mobileOpen ? styles.burgerLine1Open : ''}`}
            />
            <span
              className={`${styles.burgerLine} ${mobileOpen ? styles.burgerLine2Open : ''}`}
            />
            <span
              className={`${styles.burgerLine} ${mobileOpen ? styles.burgerLine3Open : ''}`}
            />
          </button>
        </div>
      </header>

      {/* ─── MOBILE DRAWER ─── */}
      <div className={`${styles.mobileDrawer} ${mobileOpen ? styles.mobileDrawerOpen : ''}`}>
        <nav className={styles.mobileNav}>
          {navItems.map((item) => (
            <div key={item.label} className={styles.mobileGroup}>
              <Link
                href={item.href}
                className={styles.mobileLink}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.mega && (
                <div className={styles.mobileSub}>
                  {item.mega.items.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className={styles.mobileSublink}
                      onClick={() => setMobileOpen(false)}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className={styles.mobileCta}>
            <SplashButton color="neutral" size="md" href="/contact" fullWidth>
              Free Consultation
            </SplashButton>
          </div>
        </nav>
      </div>
    </>
  )
}