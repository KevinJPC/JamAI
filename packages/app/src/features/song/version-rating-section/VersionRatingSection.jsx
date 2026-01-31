import classNames from 'classnames'

import { useSongVersion } from '@/features/song/queries'
import { VersionRatingControl } from '@/features/song/version-rating-section/VersionRatingControl'
import { paths } from '@/shared/config/paths'
import { useRouteSearchParams } from '@/shared/hooks/useRouteSearchParams'

export function UserRatingSection ({ songId, className }) {
  const [searchParams] = useRouteSearchParams(paths.chords)
  const versionQuery = useSongVersion({ songId, versionId: searchParams.version })
  if (versionQuery.data) {
    return (
      <section className={classNames('section-box', className)}>
        <h1 className='text-md fw-bold mb-md'>Rate this version</h1>
        <VersionRatingControl
          songId={versionQuery.data.songId}
          versionId={versionQuery.data.id}
          currentUserRating={versionQuery.data.userRating}
        />
      </section>

    )
  }
}
