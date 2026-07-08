'use client'

import { useEffect, useRef, useState } from 'react'
import SplashButton from '@/components/layout/SplashButton'
import styles from './ContactExperience.module.css'

const contactInfo = [
  {
    label: 'Head Office',
    value: 'Splash Media\n5383 S 900 E, Salt Lake City, UT 84117',
    href: 'https://maps.google.com/?q=5383+S+900+E,+Salt+Lake+City,+UT+84117',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: 'Email Support',
    value: 'marketing@splashmediausa.com',
    href: 'mailto:marketing@splashmediausa.com',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "Let's Talk",
    value: '(888) 616-8111',
    href: 'tel:+18886168111',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: 'Office Hours',
    value: 'Monday – Friday\n08:00 AM – 05:00 PM',
    href: null,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
  },
]

export default function ContactExperience() {
  const sectionRef = useRef<HTMLElement>(null)
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

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
      { threshold: 0.1 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = () => {
    // Basic validation
    if (!form.name || !form.email || !form.message) return
    // Compose a mailto as a no-backend fallback
    const subject = encodeURIComponent(`New inquiry from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\n\n${form.message}`
    )
    window.location.href = `mailto:marketing@splashmediausa.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background gradient + floating accents */}
      <div className={styles.bg} aria-hidden />
      <div className={styles.glow1} aria-hidden />
      <div className={styles.glow2} aria-hidden />

      <div className={styles.inner}>
        {/* ── HEADER ── */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            Get In Touch
            <span className={styles.eyebrowLine} />
          </p>
          <h1 className={styles.title}>
            Let&apos;s make a <span className={styles.accent}>splash</span>.
          </h1>
          <p className={styles.subtitle}>
            Whether you&apos;re ready to dive in or just exploring, we&apos;d love to
            hear from you. Reach out and let&apos;s create something unforgettable.
          </p>
        </div>

        {/* ── MAIN GRID: info + form ── */}
        <div className={styles.grid}>
          {/* LEFT — contact info cards */}
          <div className={styles.infoCol}>
            {contactInfo.map((item, i) => {
              const inner = (
                <>
                  <span className={styles.infoIcon}>{item.icon}</span>
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{item.label}</span>
                    <span className={styles.infoValue}>{item.value}</span>
                  </div>
                </>
              )
              return item.href ? (
                <a
                  key={i}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={styles.infoCard}
                  style={{ '--delay': `${i * 0.08}s` } as React.CSSProperties}
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={i}
                  className={styles.infoCard}
                  style={{ '--delay': `${i * 0.08}s` } as React.CSSProperties}
                >
                  {inner}
                </div>
              )
            })}
          </div>

          {/* RIGHT — form */}
          <div className={styles.formCard}>
            {submitted ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>✓</div>
                <h3 className={styles.successTitle}>Message ready to send!</h3>
                <p className={styles.successText}>
                  Your email client should have opened. If not, reach us directly
                  at marketing@splashmediausa.com.
                </p>
              </div>
            ) : (
              <>
                <h2 className={styles.formTitle}>Send us a message</h2>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="name">
                      Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Your name"
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="you@company.com"
                    />
                  </div>

                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label className={styles.label} htmlFor="company">
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={form.company}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Your company (optional)"
                    />
                  </div>

                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label className={styles.label} htmlFor="message">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      className={styles.textarea}
                      placeholder="Tell us about your project..."
                      rows={5}
                    />
                  </div>
                </div>

                <div className={styles.submitWrap}>
                  <SplashButton color="blue" size="lg" onClick={handleSubmit}>
                    Send Message
                  </SplashButton>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── MAP ── */}
        <div className={styles.mapCard}>
          <iframe
            title="Splash Media location"
            src="https://www.google.com/maps?q=5383+S+900+E,+Salt+Lake+City,+UT+84117&output=embed"
            className={styles.map}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}