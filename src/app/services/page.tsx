import ServicesExperience from '@/components/services/ServicesExperience'

export const metadata = {
  title: 'Services | Splash Media',
  description:
    'Marketing, ad campaigns, web design, and print — four disciplines engineered to make your brand impossible to ignore.',
}

export default function ServicesPage() {
  return (
    <main className="relative">
      <ServicesExperience />
    </main>
  )
}