import classNames from 'classnames'

import { useSongVersion } from '@/features/song/queries'
import { FavoriteSongButton } from '@/features/song/song-interactions-section/FavoriteSongButton'
import { ShareButton } from '@/features/song/song-interactions-section/ShareButton'
import { CustomSkeleton } from '@/shared/components/CustomSkeleton'
import { paths } from '@/shared/config/paths'
import { useRouteSearchParams } from '@/shared/hooks/useRouteSearchParams'

import './SongInteractionsSection.css'

export function SongInteractionsSection ({ className, song }) {
  const [searchParams] = useRouteSearchParams(paths.chords)
  const versionQuery = useSongVersion({ songId: song.id, versionId: searchParams.version })

  if (versionQuery.data) {
    return (
      <ul className={classNames('song-interactions no-scrollbar', className)}>
        <li className='song-interactions__item'>
          <FavoriteSongButton
            favoritesCount={song.favoritesCount}
            songId={song.id}
            userHasFavorited={song.userHasFavorited}
          />
        </li>
        <li className='song-interactions__item'>
          <ShareButton songId={song.id} versionId={versionQuery.data.id} />
        </li>
      </ul>
    )
  }
  return <SongInteractionsSectionSkeleton />
}

export function SongInteractionsSectionSkeleton ({ className }) {
  return (
    <div className={classNames('song-interactions no-scrollbar', className)}>
      <div className='song-interactions__item'>
        <CustomSkeleton borderRadius='999px' width='80px' height='36px' />
      </div>
      <div className='song-interactions__item'>
        <CustomSkeleton borderRadius='999px' width='100px' height='36px' />
      </div>
    </div>
  )
}
