import { useYoutubePlayerContext } from '@/features/song/youtube-player/YoutubePlayerContext'
import { BackWardIcon } from '@/shared/components/icons'
import { Toolbar } from '@/shared/components/Toolbar'

export const SeekToStartControl = () => {
  const { handleSeek } = useYoutubePlayerContext()

  return (
    <Toolbar.ButtonControl
      onClick={() => handleSeek(0)}
    >
      <BackWardIcon size={24} />
    </Toolbar.ButtonControl>
  )
}
