import { InfinitePagination } from '@/shared/components/InfinitePagination'
import { LatestSongsList } from '@/shared/components/LatestSongsList'
import { SongListSkeleton } from '@/shared/components/SongListSkeleton'
import { useSongsInfiniteQuery } from '@/shared/queries/songQueries'

export function LatestSongsSection () {
  const songsQuery = useSongsInfiniteQuery()
  return (
    <article>
      <h2 className='text-lg mb-md'>Latest analyses</h2>

      {(songsQuery.isPending) && <SongListSkeleton count={10} />}

      {/* Simple message content, users are not supposed to see this anyway */}
      {(songsQuery.data && !songsQuery.data.length) && <div>No results</div>}

      {(songsQuery.data && songsQuery.data.length) && (
        <><LatestSongsList songs={songsQuery.data} />
          <InfinitePagination
            className='mt-md'
            hasNextPage={songsQuery.hasNextPage}
            isLoadingNextPageError={songsQuery.isFetchNextPageError}
            isLoadingNextPage={songsQuery.isFetchingNextPage}
            isRefetching={songsQuery.isRefetching}
            loadMoreFn={songsQuery.fetchNextPage}
          >
            <SongListSkeleton />
          </InfinitePagination>
        </>)}

    </article>
  )
}
