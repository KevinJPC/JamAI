import { ChevronDownIcon, ChevronUpIcon } from '@/shared/components/icons'
import { Toolbar } from '@/shared/components/Toolbar'
import { useSongVersionSettings } from '@/shared/song-version-settings/SongVersionSettingsContext'

export function TransposeChordsControl () {
  const songChordsSettings = useSongVersionSettings()
  const transposeDisplayValue = `${songChordsSettings.transposeValue >= 0 ? '+' : ''}${songChordsSettings.transposeValue}`
  return (
    <Toolbar.IncreaserControl
      displayValue={transposeDisplayValue}
      onIncrease={() => songChordsSettings.updateTransposeValue(songChordsSettings.transposeValue + 1)}
      onDecrease={() => songChordsSettings.updateTransposeValue(songChordsSettings.transposeValue - 1)}
      increaseContent={<ChevronUpIcon width={16} strokeWidth={3} />}
      decreaseContent={<ChevronDownIcon width={16} strokeWidth={3} />}
      title='Transpose'
    />
  )
}
