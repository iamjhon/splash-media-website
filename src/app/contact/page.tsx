import ContactExperience from '@/components/contact/ContactExperience'

export const metadata = {
  title: 'Contact | Splash Media',
  description:
    'Get in touch with Splash Media. Call (888) 616-8111, email marketing@splashmediausa.com, or visit us in Salt Lake City.',
}

export default function ContactPage() {
  return (
    <main className="relative">
      <ContactExperience />
    </main>
  )
}