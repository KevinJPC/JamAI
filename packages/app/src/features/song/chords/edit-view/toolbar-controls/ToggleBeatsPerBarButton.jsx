import { BEATS_PER_BAR } from '@chords-extractor/common/constants'

import { useEditViewContext } from '@/features/song/chords/edit-view/EditViewContext'
import { Toolbar } from '@/shared/components/Toolbar'

const TIME_SIGNATURE_TO_SHOW_BY_BEATS_PER_BAR = {
  [BEATS_PER_BAR[3]]: '3/4',
  [BEATS_PER_BAR[4]]: '4/4',
}

export function ToggleBeatsPerBarControl () {
  const { draftVersion } = useEditViewContext()
  return (
    <Toolbar.ButtonControl
      title='Time signature'
      onClick={() => draftVersion.toggleBeatsPerBar()}
    >
      {TIME_SIGNATURE_TO_SHOW_BY_BEATS_PER_BAR[draftVersion.beatsPerBar]}
    </Toolbar.ButtonControl>
  )
}
