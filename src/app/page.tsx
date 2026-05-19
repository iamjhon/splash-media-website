import Hero from '@/components/home/Hero'
import VideoIntro from '@/components/home/VideoIntro'

export default function Home() {
  return (
    <main className="relative" style={{ background: '#020617' }}>
      <Hero />
      {/* Spacer to give VideoIntro's scroll trigger room to fire */}
      <div style={{ height: '100vh' }} />
      <VideoIntro />
    </main>
  )
}