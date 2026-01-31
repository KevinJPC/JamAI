import classNames from 'classnames'

import { CustomSkeleton } from '@/shared/components/CustomSkeleton'

import './SongHeader.css'

export function SongHeader ({ song, className }) {
  return (
    <header
      className={classNames('song-header', className)}
    >
      <h1 className='text-lg line-clamp-1'>{song.title}</h1>
    </header>
  )
}

export function SongHeaderSkeleton ({ className }) {
  return (
    <CustomSkeleton
      containerClassName={className}
      width='100%'
      fullWidthContainer
      maxWidth={400}
    />
  )
}
