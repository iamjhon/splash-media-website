import HomeExperience from '@/components/home/HomeExperience'
import AboutReveal from '@/components/home/AboutReveal'
import Partners from '@/components/home/Partners'

export default function Home() {
  return (
    <main className="relative">
      <HomeExperience />
      <Partners /> 
      <AboutReveal />
    </main>
  )
}