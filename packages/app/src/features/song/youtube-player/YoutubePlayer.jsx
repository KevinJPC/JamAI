import ReactPlayer from 'react-player'
import classNames from 'classnames'

import { ExclamationCircle } from '@/shared/components/icons'

import { PLAYER_ERROR_CODES, PLAYER_LOADING_STATUS, REACT_PLAYER_DEFAULT_PROPS_CONFIG } from './constans'
import { useYoutubePlayerContext } from './YoutubePlayerContext'

import './YoutubePlayer.css'

export const YoutubePlayer = ({
  className,
}) => {
  const playerContext = useYoutubePlayerContext()
  return (
    <div className={classNames('player-wrapper', className)}>
      <ReactPlayer
        {...REACT_PLAYER_DEFAULT_PROPS_CONFIG}
        className='player'
        src={playerContext.src}
        key={playerContext.src}
        ref={playerContext.playerRef}
        volume={playerContext.volume.current}
        muted={playerContext.isMuted}
        controls={playerContext.false}
        playing={playerContext.isPlaying}
        onProgress={playerContext.handleInitialLoad}
        onSeeked={playerContext.handleSeeked}
        onPlay={playerContext.handlePlay}
        onPause={playerContext.handlePause}
        onError={playerContext.handleError}

      />
      {playerContext.loadingStatus === PLAYER_LOADING_STATUS.LOADING && <YoutubePlayerLoader />}

      {playerContext.loadingStatus === PLAYER_LOADING_STATUS.ERROR &&
        <ErrorPanel errorCode={playerContext.errorCode} className='player__error' />}
    </div>
  )
}

export function YoutubePlayerLoader () {
  return <div className='player__skeleton' />
}

const PLAYER_ERROR_MESSAGES_BY_CODES = {
  [PLAYER_ERROR_CODES.NOT_FOUND]:
    'This video can’t be played. It may have been removed or set to private. You can still view and customize the chords.',

  [PLAYER_ERROR_CODES.UNAVAILABLE]:
    'This video is currently unavailable. You can still view and customize the chords.',

  [PLAYER_ERROR_CODES.UNKNOWN]:
    'We can’t play this video right now due to an unexpected error. Please try again later.',
}

function ErrorPanel ({ errorCode, className }) {
  const errorMessage = PLAYER_ERROR_MESSAGES_BY_CODES[errorCode]
  return (
    <div className={classNames('player__error', className)}>
      <ExclamationCircle size={24} />
      <p className='player__error-message'>
        {errorMessage}
      </p>
    </div>
  )
}
