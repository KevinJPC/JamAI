import { useYoutubePlayerContext } from '@/features/song/youtube-player/YoutubePlayerContext'
import { PauseIcon, PlayIcon } from '@/shared/components/icons'
import { Toolbar } from '@/shared/components/Toolbar'

export const TogglePlayControl = () => {
  const playerContext = useYoutubePlayerContext()
  const handleClick = () => playerContext.isPlaying
    ? playerContext.handlePause()
    : playerContext.handlePlay()

  return (
    <Toolbar.ButtonControl
      onClick={handleClick}
    >
      {playerContext.isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
    </Toolbar.ButtonControl>
  )
}
