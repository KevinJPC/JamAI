import { roundDecimals } from '@chords-extractor/common/utils'
import classNames from 'classnames'

import { StarIcon } from '@/shared/components/icons'

import './RatingSummary.css'

export function RatingSummary ({ ratingAverage, ratingCount, className, iconSize = 16 }) {
  const roundedAverage = roundDecimals(ratingAverage, 2)
  return (
    <div className={classNames('rating-summary', className)}>
      <StarIcon width={iconSize} />
      <span className='rating-summary__average'>{roundedAverage}</span>
      <span className='rating-summary__count-wrapper'>
        (
        <span className='rating-summary__count'>{ratingCount}</span>
        )
      </span>
    </div>
  )
}
