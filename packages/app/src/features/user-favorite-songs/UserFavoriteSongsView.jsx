import { useUserFavoriteSongsInfiniteQuery } from '@/features/user-favorite-songs/queries'
import { UserFavoriteSongsList } from '@/features/user-favorite-songs/UserFavoriteSongsList'
import { AlertBox } from '@/shared/components/AlertBox'
import { InfinitePagination } from '@/shared/components/InfinitePagination'
import { SongListSkeleton } from '@/shared/components/SongListSkeleton'

import './UserFavoriteSongsView.css'

export function UserFavoriteSongsView () {
  const favoritesSongsQuery = useUserFavoriteSongsInfiniteQuery()
  return (
    <main className='container user-favorite-songs-view'>
      <h1 className='mb-md text-lg'>My favorites songs</h1>
      {favoritesSongsQuery.isPending && <SongListSkeleton count={10} />}
      {favoritesSongsQuery.data && favoritesSongsQuery.data.hasResults && (
        <>
          <UserFavoriteSongsList favoritesSongs={favoritesSongsQuery.data.results} />
          <InfinitePagination
            className='mt-md'
            hasNextPage={favoritesSongsQuery.hasNextPage}
            isLoadingNextPage={favoritesSongsQuery.isFetchingNextPage}
            isLoadingNextPageError={favoritesSongsQuery.isFetchNextPageError}
            loadMoreFn={favoritesSongsQuery.fetchNextPage}
          >
            <SongListSkeleton count={1} />
          </InfinitePagination>
        </>
      )}
      {favoritesSongsQuery.data && !favoritesSongsQuery.data.hasResults && (
        <AlertBox
          title='No favorite songs yet'
          message='Add songs to your favorites to see them here.'
        />
      )}

    </main>
  )
}
