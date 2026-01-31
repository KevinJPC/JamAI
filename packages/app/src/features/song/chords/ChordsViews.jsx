import { useEffect } from 'react'
import classNames from 'classnames'

import { ChordsViewsSkeleton } from '@/features/song/chords/ChordsViewsSkeleton'
import { EditView } from '@/features/song/chords/edit-view/EditView'
import { GeneralView } from '@/features/song/chords/general-view/GeneralView'
import { VersionSelector } from '@/features/song/chords/version-selector/VersionSelectorModal'
import { useSongVersion } from '@/features/song/queries'
import { Tabs } from '@/shared/components/Tabs'
import { paths } from '@/shared/config/paths'
import { CHORDS_TABS_IDS } from '@/shared/constants'
import { useRouteSearchParams } from '@/shared/hooks/useRouteSearchParams'
import { SongVersionSettingsProvider } from '@/shared/song-version-settings/SongVersionSettingsProvider'

import './ChordsViews.css'

export function ChordsViews ({ song, viewToolbarClassName, className }) {
  const [searchParams, updateSearchParams] = useRouteSearchParams(paths.chords)

  const versionQuery = useSongVersion({ songId: song.id, versionId: searchParams.version })

  useEffect(() => {
    // URL reconciliation
    const shouldReconciliateSearchParams =
      versionQuery.data === null ||
      searchParams.version === undefined

    if (shouldReconciliateSearchParams) {
      updateSearchParams(prev => ({ ...prev, version: song.defaultVersion.id }), { replace: true, preventScrollToTop: true })
    }
  }, [versionQuery.data, searchParams.version])

  const activeTab = searchParams.view ?? CHORDS_TABS_IDS.general
  const setActiveTab = (newTab) => {
    updateSearchParams((prev) => ({ ...prev, view: newTab }), { replace: true, preventScrollToTop: true })
  }

  if (versionQuery.data) {
    return (
      <div className={classNames('chords-views', className)}>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
          <div className={classNames('chords-views__labels-wrapper')}>
            <Tabs.Labels>
              <Tabs.Label id={CHORDS_TABS_IDS.general}>General</Tabs.Label>
              <Tabs.Label id={CHORDS_TABS_IDS.edit}>
                Edit
              </Tabs.Label>
            </Tabs.Labels>

            <VersionSelector currentVersion={versionQuery.data} />
          </div>

          <SongVersionSettingsProvider
            key={versionQuery.data.id}
            songId={versionQuery.data.songId}
            versionId={versionQuery.data.id}
            versionKey={versionQuery.data.key}
          >
            <Tabs.Views>
              <Tabs.View id={CHORDS_TABS_IDS.general}>
                <GeneralView
                  version={versionQuery.data}
                  toolbarClassName={viewToolbarClassName}
                />
              </Tabs.View>
              <Tabs.View id={CHORDS_TABS_IDS.edit}>
                <EditView
                  toolbarClassName={viewToolbarClassName}
                  version={versionQuery.data}
                  userVersionId={song.userVersionId}
                />
              </Tabs.View>
            </Tabs.Views>
          </SongVersionSettingsProvider>
        </Tabs>
      </div>

    )
  }

  return <ChordsViewsSkeleton />
}
