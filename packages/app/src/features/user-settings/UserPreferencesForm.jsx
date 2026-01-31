import Chord from '@chords-extractor/common/chord'
import classNames from 'classnames'

import { useUserPreferences } from '@/shared/user-preferences/UserPreferencesContext'

import './UserPreferencesForm.css'

export function UserPreferencesForm ({ className }) {
  const userPrefences = useUserPreferences()

  const handleUpdateChordsNotationSystem = (e) => {
    userPrefences.updateChordsNotationSystem(e.currentTarget.value)
  }

  const handleChangePersistSongsChordsSettings = (e) => {
    userPrefences.updatePersistSongVersionsSettings(e.currentTarget.checked)
  }

  return (
    <form className={classNames('user-preferences-form', className)}>
      <div className='user-preferences-form__chords-language-wrapper'>
        <label className='user-preferences-form__chords-language-label'>
          Chords notation system:
        </label>

        <RadioButton
          label='English - C D E F G A B'
          checked={userPrefences.chordsNotationSystem === Chord.supportedNotationsSystems.english}
          value={Chord.supportedNotationsSystems.english}
          onChange={handleUpdateChordsNotationSystem}
        />

        <RadioButton
          label='Latin - Do Re Mi Fa Sol La Si'
          checked={userPrefences.chordsNotationSystem === Chord.supportedNotationsSystems.latin}
          value={Chord.supportedNotationsSystems.latin}
          onChange={handleUpdateChordsNotationSystem}
        />
      </div>

      <Checkbox
        label='Save song chords settings locally'
        onChange={handleChangePersistSongsChordsSettings}
        checked={userPrefences.persistSongVersionsSettings}
      />

    </form>
  )
}

function RadioButton ({ label, name, checked, onChange, value }) {
  return (
    <label className='user-preferences-form__chords-language-radios'>
      <input
        className='user-preferences-form__chords-language-inputs-radios'
        type='radio'
        name={name}
        checked={checked}
        value={value}
        onChange={onChange}
      />
      {label}
    </label>
  )
}

function Checkbox ({ onChange, checked, label }) {
  return (
    <label className='user-preferences-form__label-checkbox'>
      <input
        type='checkbox'
        className='user-preferences-form__checkbox'
        name='persist-song-chords-settings'
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  )
}
