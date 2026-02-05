import { toast } from 'react-toastify'

import { Button, BUTTON_VARIANTS } from '@/shared/components/Button'
import { ShareIcon } from '@/shared/components/icons/ShareIcon'
import { paths } from '@/shared/config/paths'
import { GENERAL_CONTAINER_ID } from '@/shared/toasts/constants'

import './ShareButton.css'

export function ShareButton ({ songId, versionId }) {
  const handleClick = async () => {
    const href = window.location.origin + paths.chords.build({
      params: { songId },
      search: { version: versionId }
    })
    await navigator.clipboard.writeText(href).catch(_ => {
      toast.error('Could not copy link to clipboard!', { containerId: GENERAL_CONTAINER_ID })
    })
    toast.success('Link copied to clipboard!', { containerId: GENERAL_CONTAINER_ID })
  }
  return (
    <Button
      onClick={handleClick}
      className='song-share-button'
      variant={BUTTON_VARIANTS.secondary}
    >
      <ShareIcon size={22} /> Share
    </Button>
  )
}
