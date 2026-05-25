import Hero from '@/components/home/Hero'
import VideoIntro from '@/components/home/VideoIntro'
import Testimonials from '@/components/home/Testimonials'

export default function Home() {
  return (
    <main className="relative" style={{ background: '#020617' }}>
      <Hero />
      <VideoIntro />
      <Testimonials />
    </main>
  )
}