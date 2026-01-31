import { UserAccountSettingsForm } from '@/features/user-settings/UserAccountSettingsForm.jsx'
import { UserPreferencesForm } from '@/features/user-settings/UserPreferencesForm'

import './UserSettingsView.css'

export function UserSettingsView () {
  return (
    <main className='user-settings-view container'>
      <header>
        <h1 className='user-settings-view__title'>Settings</h1>
        <p className='user-settings-view__legend'>Manage your account and local preferences</p>
      </header>
      <AccountSettingsSection />
      <LocalPreferencesSection />
    </main>
  )
}

function AccountSettingsSection () {
  return (
    <section className='user-settings-view__section'>
      <h1 className='user-settings-view__secondary-title'>Account</h1>
      <UserAccountSettingsForm className='user-settings-view__form' />
    </section>
  )
}

function LocalPreferencesSection () {
  return (
    <section className='user-settings-view__section'>
      <h1 className='user-settings-view__secondary-title'>Preferences</h1>
      <UserPreferencesForm className='user-settings-view__form' />
    </section>
  )
}
