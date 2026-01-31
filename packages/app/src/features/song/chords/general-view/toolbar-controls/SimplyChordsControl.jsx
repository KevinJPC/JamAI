import { ArrowsPointingIn } from '@/shared/components/icons'
import { Toolbar } from '@/shared/components/Toolbar'
import { useSongVersionSettings } from '@/shared/song-version-settings/SongVersionSettingsContext'

export function SimplifyChordsControl () {
  const songChordsSettings = useSongVersionSettings()

  return (
    <Toolbar.SwitchControl
      title='Simplify'
      value={songChordsSettings.simplify}
      onChange={(value) => songChordsSettings.updateSimplify(value)}
    >
      <ArrowsPointingIn width={22} />
    </Toolbar.SwitchControl>
  )
}
