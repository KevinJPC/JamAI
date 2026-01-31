import { useUserVersionsInfiniteQuery } from '@/features/user-versions/queries'
import { UserVersionsList } from '@/features/user-versions/UserVersionsList'
import { AlertBox } from '@/shared/components/AlertBox'
import { InfinitePagination } from '@/shared/components/InfinitePagination'
import { SongListSkeleton } from '@/shared/components/SongListSkeleton'

import './UserVersionsView.css'

export function UserVersionsView () {
  const versionsQuery = useUserVersionsInfiniteQuery()

  return (
    <main className='container user-versions-view'>
      <h1 className='mb-md text-lg'>My songs versions</h1>

      {versionsQuery.isPending && <SongListSkeleton count={10} />}

      {versionsQuery.data && versionsQuery.data.hasResults && (
        <>
          <UserVersionsList versions={versionsQuery.data.results} />
          <InfinitePagination
            className='mt-md'
            hasNextPage={versionsQuery.hasNextPage}
            isLoadingNextPage={versionsQuery.isFetchingNextPage}
            isLoadingNextPageError={versionsQuery.isFetchingNextPageError}
            loadMoreFn={versionsQuery.fetchNextPage}
          >
            <SongListSkeleton count={1} />
          </InfinitePagination>
        </>
      )}

      {versionsQuery.data && !versionsQuery.data.hasResults && (
        <AlertBox
          title='No song versions yet'
          message='Create your own song versions with improved chords to see them here.'
        />
      )}

    </main>
  )
}
