import { useEffect, useState } from 'react'

import { EditViewContext } from '@/features/song/chords/edit-view/EditViewContext'
import { useDraftVersion } from '@/features/song/chords/edit-view/useDraftVersion'
import { Dialog } from '@/shared/components/Dialog'
import { useDialog } from '@/shared/hooks/useDialog'

export function EditViewProvider ({ originalVersion, userVersionId, children }) {
  const [dialog, setDialog] = useDialog()
  const draftVersion = useDraftVersion(originalVersion)
  const userHasVersion = userVersionId !== null
  const isDraftOfUserVersion = userHasVersion && draftVersion.originalVersionId === userVersionId

  useEffect(() => {
    if (!draftVersion.hasDraftRecovery) return

    const askShouldRestoreDraftVersion = async () => {
      const shouldRestoreDraftVersion = await setDialog(({ answer, close }) =>
        <RestoreUnsavedDraftVersion
          onCancel={() => answer(false)}
          onConfirm={() => answer(true)}
          onClose={close}
        />)
      if (shouldRestoreDraftVersion) {
        draftVersion.applyDraftRecovery()
      } else {
        draftVersion.clearDraftRecovery()
      }
    }

    askShouldRestoreDraftVersion()
  }, [originalVersion.id])

  return (
    <EditViewContext.Provider value={{
      draftVersion,
      userVersionId,
      userHasVersion,
      isDraftOfUserVersion
    }}
    >
      {dialog}
      {children}
    </EditViewContext.Provider>
  )
}

const RestoreUnsavedDraftVersion = ({ onConfirm, onCancel, onClose }) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
      onExit={onClose}
      titleContent='Unsaved changes found'
      messageContent='You have unsaved changes from this song version, would you like to restore them?'
    />
  )
}
