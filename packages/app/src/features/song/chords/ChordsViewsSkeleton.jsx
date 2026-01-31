import classNames from 'classnames'

import { ChordsGrid, ChordSkeleton, generateChordKey } from '@/features/song/chords/ChordsGrid'
import { CustomSkeleton } from '@/shared/components/CustomSkeleton'

import './ChordsView.css'
import './ChordsViews.css'

export function ChordsViewsSkeleton ({ className, viewToolbarClassName }) {
  return (
    <div className={classNames('chords-views', className)}>
      <CustomSkeleton
        flexContainer
        height='40px'
        maxWidth='200px'
      />

      <div className={classNames('chords-view', className)}>
        <div className={classNames('chords-view__toolbar-wrapper', viewToolbarClassName)}>
          <CustomSkeleton
            fullWidthContainer
            fullHeightContainer
          />
        </div>
        <ChordsGrid className={classNames('chords-view__grid-wrapper chords-views__grid', className)}>
          {Array.from({ length: 200 }).map((_, index) => {
            return (
              <ChordSkeleton key={generateChordKey(index)} />
            )
          })}
        </ChordsGrid>
      </div>
    </div>

  )
}
