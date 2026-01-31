import { useYoutubePlayerContext } from '@/features/song/youtube-player/YoutubePlayerContext'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@/shared/components/icons'
import { Slider } from '@/shared/components/Slider'
import { Toolbar } from '@/shared/components/Toolbar'

import './ToolbarVolumeControl.css'

export function VolumeControl () {
  const playerContext = useYoutubePlayerContext()

  const handleChange = (e) => playerContext.handleVolumeChange(Number(e.target.value) / 100)

  return (
    <div className='toolbar-volume-control-wrapper'>
      <Toolbar.ButtonControl
        className='toolbar-volume-control__mute-button'
        variant='transparent'
        onClick={playerContext.isMuted ? playerContext.handleUnmute : playerContext.handleMute}
      >
        {playerContext.isMuted ? <SpeakerXMarkIcon width={24} /> : <SpeakerWaveIcon width={24} />}
      </Toolbar.ButtonControl>
      <Slider
        min={0}
        max={100}
        value={playerContext.volume.current * 100}
        step={1}
        onChange={handleChange}
        className='toolbar-volume-control__slider'
      />
    </div>
  )
}
