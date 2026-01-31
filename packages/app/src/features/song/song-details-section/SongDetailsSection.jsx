import Key from '@chords-extractor/common/key'
import { roundDecimals } from '@chords-extractor/common/utils'
import classNames from 'classnames'

import { useSongVersion } from '@/features/song/queries'
import { CollapsedBox } from '@/shared/components/CollapsedBox'
import { CustomSkeleton } from '@/shared/components/CustomSkeleton'
import { Logo } from '@/shared/components/Logo'
import { RatingSummary } from '@/shared/components/RatingSummary'
import { paths } from '@/shared/config/paths'
import { useRouteSearchParams } from '@/shared/hooks/useRouteSearchParams'

import './SongDetails.css'

export function SongDetailsSection ({ song, className }) {
  const [searchParams] = useRouteSearchParams(paths.chords)
  const versionQuery = useSongVersion({ songId: song.id, versionId: searchParams.version })

  if (versionQuery.data) {
    return (
      <CollapsedBox as='section' className={classNames('section-box', className)}>
        <h1 className='text-md fw-bold mb-md'>About this song</h1>
        <SongDetails song={song} version={versionQuery.data} />
        <CollapsedBox.ToggleButton openContent='Show less' closeContent='Show more' />
      </CollapsedBox>
    )
  }

  return <SongDetailsSectionSkeleton />
}

function SongDetails ({ song, version }) {
  return (
    <ul className='song-details'>
      <li className='song-details__item'>
        Youtube channel
        <span className='song-details__item-pill'>
          {song.youtubeChannel.name}
        </span>
      </li>
      <li className='song-details__item'>
        Version by
        <span className='song-details__item-pill'>
          {version.isSystemVersion ? <Logo /> : version.user.name}
        </span>
      </li>
      <li className='song-details__item'>
        Key
        <span className='song-details__item-pill'>
          {Key.getPreferredKeyLabelFromKey(version.key)}
        </span>
      </li>
      <li className='song-details__item'>
        Rating
        <span className='song-details__item-pill'>
          <RatingSummary
            ratingAverage={version.ratingAverage}
            ratingCount={version.ratingCount}
          />
        </span>
      </li>
      <li className='song-details__item'>
        Bpm
        <span className='song-details__item-pill'>
          {roundDecimals(version.bpm, 2)}
        </span>
      </li>
    </ul>
  )
}

export function SongDetailsSectionSkeleton ({ className }) {
  return (
    <CustomSkeleton isContainer padding='1rem' width='100%' height={150} className={className}>
      <CustomSkeleton height={19.2} width={200} brighter className='mb-md' />
      <div className='song-details'>
        <CustomSkeleton height={19.2} width='100%' maxWidth='250px' brighter fullWidthContainer />
        <CustomSkeleton height={19.2} width='100%' maxWidth='300px' brighter fullWidthContainer />
        <CustomSkeleton height={13.2} width='100%' maxWidth='150px' brighter fullWidthContainer />
      </div>
    </CustomSkeleton>
  )
}
