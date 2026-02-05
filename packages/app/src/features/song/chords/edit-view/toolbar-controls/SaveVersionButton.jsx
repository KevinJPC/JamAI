import { useState } from 'react'
import { toast } from 'react-toastify'

import { useEditViewContext } from '@/features/song/chords/edit-view/EditViewContext'
import { useSaveUserSongVersion } from '@/features/song/queries'
import { useAuth } from '@/shared/auth/AuthContext'
import { AuthModal } from '@/shared/auth/AuthModal'
import { Dialog } from '@/shared/components/Dialog'
import { CasetteIcon } from '@/shared/components/icons'
import { Link } from '@/shared/components/Link'
import { Spinner } from '@/shared/components/Spinner'
import { Toolbar } from '@/shared/components/Toolbar'
import { paths } from '@/shared/config/paths'
import { useDialog } from '@/shared/hooks/useDialog'
import { useRouteSearchParams } from '@/shared/hooks/useRouteSearchParams'
import { useSongVersionSettings } from '@/shared/song-version-settings/SongVersionSettingsContext'
import { updatePersistedSongVersionSettings } from '@/shared/song-version-settings/storage'
import { GENERAL_CONTAINER_ID } from '@/shared/toasts/constants'
import { useUserPreferences } from '@/shared/user-preferences/UserPreferencesContext'

export function SaveVersionButton () {
  const auth = useAuth()
  const { draftVersion, userVersionId, userHasVersion, isDraftOfUserVersion } = useEditViewContext()
  const [,updateSearchParams] = useRouteSearchParams(paths.chords)

  const saveVersionMutation = useSaveUserSongVersion()
  const userPreferences = useUserPreferences()
  const songVersionSettings = useSongVersionSettings()

  const [dialog, setDialog] = useDialog()

  const saveEditedVersion = async () => {
    if (!auth.isAuthenticated) {
      await setDialog(({ close }) =>
        <AuthModal initialFormView='login' onClose={close} />
      )

      return
    }

    if (userHasVersion && !isDraftOfUserVersion) {
      const wantToOverrideUserVersion = await setDialog(({ answer, close }) =>
        <OverrideExistingVersionDialog
          songId={draftVersion.songId}
          userVersionId={userVersionId}
          onCancel={() => answer(false)}
          onConfirm={() => answer(true)}
          onClose={close}
        />)

      if (!wantToOverrideUserVersion) return
    }

    saveVersionMutation.mutate({
      originalVersionId: draftVersion.originalVersionId,
      songId: draftVersion.songId,
      beatChords: draftVersion.beatChords,
      shiftViewValue: draftVersion.shiftViewValue,
      beatsPerBar: draftVersion.beatsPerBar
    }, {
      onSuccess: (versionData) => {
        draftVersion.clearDraftRecovery()

        if (isDraftOfUserVersion) return

        if (userPreferences.persistSongVersionsSettings) {
          // ux ensure created version have current version settings
          updatePersistedSongVersionSettings({ songId: draftVersion.songId, versionId: versionData.id, }, songVersionSettings)
        }
        updateSearchParams((prev) => ({ ...prev, version: versionData.id }), { replace: true })
        toast.success('Song version created and now being displayed.', { containerId: GENERAL_CONTAINER_ID })
      },
      onError: () => {
        toast.error('Error saving song version.', { containerId: GENERAL_CONTAINER_ID })
      }
    })
  }

  const hasChangesToSave = draftVersion.lastEditAt > saveVersionMutation.submittedAt

  return (
    <>
      {dialog}
      <Toolbar.ButtonControl
        title='Save'
        disabled={saveVersionMutation.isPending || !hasChangesToSave}
        onClick={saveEditedVersion}
      >
        {saveVersionMutation.isPending ? <Spinner size={18} /> : <CasetteIcon width={22} />}
      </Toolbar.ButtonControl>
    </>
  )
}

const OverrideExistingVersionDialog = ({ onConfirm, onCancel, onClose, songId, userVersionId }) => {
  const [isOpen, setIsOpen] = useState(true)

  const userVersionLink = `/chords/${songId}?version=${userVersionId}`
  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
      onExit={onClose}
      titleContent='You already have a version'
      messageContent={<>Your current <Link decorator to={userVersionLink}>version</Link> of this song will be replaced if you save another one.</>}
    />
  )
}
