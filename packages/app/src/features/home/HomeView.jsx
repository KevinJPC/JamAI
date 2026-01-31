import { HomeHero } from '@/features/home/HomeHero'
import { LatestSongsSection } from '@/features/home/LatestSongsSection'

export function HomeView () {
  return (
    <main className='container'>
      <HomeHero />

      <LatestSongsSection />
    </main>
  )
}
