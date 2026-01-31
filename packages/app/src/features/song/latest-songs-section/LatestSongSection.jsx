import classNames from 'classnames'
import { useParams } from 'wouter'

import { CustomSkeleton } from '@/shared/components/CustomSkeleton'
import { LatestSongsList } from '@/shared/components/LatestSongsList'
import { SongListSkeleton } from '@/shared/components/SongListSkeleton'
import { useSongsInfiniteQuery } from '@/shared/queries/songQueries'

export function LatestSongsSection ({ className }) {
  const songsQuery = useSongsInfiniteQuery()
  const { songId } = useParams()

  if (songsQuery.isPending) return <LatestSongsSectionSkeleton />

  const maxSongsToShow = 4
  const songsToShow = songsQuery.data.filter(song => song.id !== songId).slice(0, maxSongsToShow)

  return (
    <article className={classNames('section-box', className)}>
      <h1 className='text-md fw-bold mb-md'>Latest analyses</h1>
      <LatestSongsList songs={songsToShow} />
    </article>
  )
}
export function LatestSongsSectionSkeleton ({ className }) {
  return (
    <CustomSkeleton
      isContainer
      padding='1rem'
      width='100%'
      className={className}
    >

      <CustomSkeleton className='mb-md' height={19.2} width={200} brighter />
      <SongListSkeleton count={4} brighter />
    </CustomSkeleton>
  )
}
