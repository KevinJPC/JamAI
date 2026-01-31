import { ScrollIcon } from '@/shared/components/icons'
import { Toolbar } from '@/shared/components/Toolbar'
import { useUserPreferences } from '@/shared/user-preferences/UserPreferencesContext'

export function AutoScrollControl () {
  const userPreferences = useUserPreferences()

  return (
    <Toolbar.SwitchControl
      value={userPreferences.autoScroll}
      onChange={(val) => userPreferences.updateAutoScroll(val)}
      title='Auto-scroll'
    >
      <ScrollIcon width={22} />
    </Toolbar.SwitchControl>
  )
}
