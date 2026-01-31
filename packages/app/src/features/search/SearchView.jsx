import { useYoutubeSearchQuery } from '@/features/search/queries'
import { YoutubeSearchList } from '@/features/search/YoutubeSearchList'
import { AlertBox } from '@/shared/components/AlertBox'
import { SongListSkeleton } from '@/shared/components/SongListSkeleton'
import { paths } from '@/shared/config/paths'
import { useRouteSearchParams } from '@/shared/hooks/useRouteSearchParams'

import './SearchView.css'

export function SearchView () {
  const [{ q }] = useRouteSearchParams(paths.search)

  const searchQuery = useYoutubeSearchQuery({ q })

  if (searchQuery.data) {
    return (
      <main className='container search-main'>
        {searchQuery.data.hasResults && <YoutubeSearchList results={searchQuery.data.results} query={q} />}
        {!searchQuery.data.hasResults &&
          <AlertBox
            title='No results'
            message='We couldn’t find anything. Try searching for something else.'
          />}
      </main>
    )
  }
  return (
    <div className='container search-main'>
      <SongListSkeleton count={10} />
    </div>
  )
}
