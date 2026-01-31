import { useEditViewContext } from '@/features/song/chords/edit-view/EditViewContext'
import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/components/icons'
import { Toolbar } from '@/shared/components/Toolbar'

export function ShiftViewControl () {
  const { draftVersion } = useEditViewContext()
  return (
    <Toolbar.IncreaserControl
      title='Shift view'
      displayValue={draftVersion.shiftViewValue}
      decreaseContent={<ChevronLeftIcon width={16} strokeWidth={3} />}
      increaseContent={<ChevronRightIcon width={16} strokeWidth={3} />}
      onIncrease={() => draftVersion.shiftView(draftVersion.shiftViewValue + 1)}
      onDecrease={() => draftVersion.shiftView(draftVersion.shiftViewValue - 1)}
    />
  )
}
