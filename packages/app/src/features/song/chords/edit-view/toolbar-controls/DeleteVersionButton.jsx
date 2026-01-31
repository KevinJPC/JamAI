import { useState } from 'react'
import { toast } from 'react-toastify'

import { useEditViewContext } from '@/features/song/chords/edit-view/EditViewContext'
import { useDeleteUserSongVersion } from '@/features/song/queries'
import { Dialog } from '@/shared/components/Dialog'
import { TrashIcon } from '@/shared/components/icons'
import { Spinner } from '@/shared/components/Spinner'
import { Toolbar } from '@/shared/components/Toolbar'
import { paths } from '@/shared/config/paths'
import { CHORDS_TABS_IDS } from '@/shared/constants'
import { useDialog } from '@/shared/hooks/useDialog'
import { useRouteSearchParams } from '@/shared/hooks/useRouteSearchParams'

export function DeleteVersionButton () {
  const { draftVersion, isDraftOfUserVersion } = useEditViewContext()
  const deleteVersionMutation = useDeleteUserSongVersion()
  const [,updateSearchParams] = useRouteSearchParams(paths.chords)

  const [dialog, setDialog] = useDialog()

  const handleOnClick = async () => {
    if (!isDraftOfUserVersion) return

    const shouldDelete = await setDialog(({ answer, close }) =>
      <DeleteVersionDialog
        onCancel={() => answer(false)}
        onConfirm={() => answer(true)}
        onClose={close}
      />)

    if (!shouldDelete) return

    deleteVersionMutation.mutate({ songId: draftVersion.songId, versionId: draftVersion.originalVersionId }, {
      onSuccess: () => {
        draftVersion.clearDraftRecovery()
        updateSearchParams({ view: CHORDS_TABS_IDS.general }, { replace: true })
        toast.success('Version deleted. Displaying default version...', { containerId: 'general' })
      },
      onError: () => {
        toast.error('Error deleting version.', { containerId: 'general' })
      }
    })
  }

  return (
    <>
      {dialog}
      <Toolbar.ButtonControl
        title='Delete'
        disabled={!isDraftOfUserVersion || deleteVersionMutation.isPending}
        onClick={handleOnClick}
      >
        {deleteVersionMutation.isPending ? <Spinner size={18} /> : <TrashIcon width={22} />}
      </Toolbar.ButtonControl>
    </>

  )
}

const DeleteVersionDialog = ({ onConfirm, onCancel, onClose }) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
      onExit={onClose}
      titleContent='Delete version'
      messageContent='Are you sure that you want to your current song version?'
    />
  )
}
