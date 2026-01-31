import { ChordsViews } from '@/features/song/chords/ChordsViews'
import { ChordsViewsSkeleton } from '@/features/song/chords/ChordsViewsSkeleton'
import { LatestSongsSection, LatestSongsSectionSkeleton } from '@/features/song/latest-songs-section/LatestSongSection'
import { useSong, useSongVersion } from '@/features/song/queries'
import { SongDetailsSection, SongDetailsSectionSkeleton } from '@/features/song/song-details-section/SongDetailsSection'
import { SongHeader, SongHeaderSkeleton } from '@/features/song/song-header/SongHeader'
import { SongInteractionsSection, SongInteractionsSectionSkeleton } from '@/features/song/song-interactions-section/SongInteractionsSection'
import { UserRatingSection } from '@/features/song/version-rating-section/VersionRatingSection'
import { YoutubePlayer } from '@/features/song/youtube-player/YoutubePlayer'
import { YoutubePlayerProvider } from '@/features/song/youtube-player/YoutubePlayerProvider'
import { CustomSkeleton } from '@/shared/components/CustomSkeleton.jsx'
import { paths } from '@/shared/config/paths'
import { useRouteSearchParams } from '@/shared/hooks/useRouteSearchParams'
import { notFound } from '@/shared/utils/notFound'

import './SongView.css'

export const SongView = ({ songId }) => {
  const [searchParams,] = useRouteSearchParams(paths.chords)

  const songQuery = useSong({ id: songId })

  // prefetches song version if version param is present
  useSongVersion({ songId, versionId: searchParams.version })

  if (songQuery.data === null) return notFound()

  if (songQuery.data) {
    return (
      <main className='song'>

        <SongHeader song={songQuery.data} className='song__sticky-element song__header' />

        <YoutubePlayerProvider youtubeId={songQuery.data.youtubeId}>
          <aside className='song__sidebar song__sticky-element'>
            <div className='song__player song__sticky-element'>
              <YoutubePlayer />
            </div>
            <SongInteractionsSection song={songQuery.data} className='song__interactions-section' />
            <SongDetailsSection song={songQuery.data} className='song__details-section' />
            <UserRatingSection songId={songQuery.data.id} className='song__version-rating-section' />
            <LatestSongsSection className='song__latest-songs-section' />
          </aside>
          <ChordsViews
            song={songQuery.data}
            className='song__chords-views'
            viewToolbarClassName='song__chords-views-toolbar song__sticky-element'
          />
        </YoutubePlayerProvider>

      </main>
    )
  }
  return <SongViewSkeleton />
}

function SongViewSkeleton () {
  return (
    <div className='song'>
      <SongHeaderSkeleton className='song__sticky-element song__header' />

      <div className='song__sidebar song__sticky-element'>
        {/* Player skeleton */}
        <CustomSkeleton
          fullWidthContainer style={{ aspectRatio: '16/9' }}
          containerClassName='song__player song__sticky-element'
        />
        <SongInteractionsSectionSkeleton className='song__interactions-section' />
        <SongDetailsSectionSkeleton className='song__details-section' />
        <LatestSongsSectionSkeleton className='song__latest-songs-section' />
      </div>

      <ChordsViewsSkeleton
        className='song__chords-views'
        viewToolbarClassName='song__chords-views-toolbar song__sticky-element'
      />

    </div>
  )
}
