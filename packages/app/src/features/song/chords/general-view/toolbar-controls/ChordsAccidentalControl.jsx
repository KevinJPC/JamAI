import Chord from '@chords-extractor/common/chord'

import { Toolbar } from '@/shared/components/Toolbar'
import { useSongVersionSettings } from '@/shared/song-version-settings/SongVersionSettingsContext'

export function ChordsAccidentalControl () {
  const songChordsSettings = useSongVersionSettings()
  return (
    <Toolbar.ButtonControl
      title='Accidental'
      onClick={() => songChordsSettings.toggleAccidental()}
    >
      {songChordsSettings.accidental === Chord.accidentals.sharp ? '#' : 'b'}
    </Toolbar.ButtonControl>
  )
}
