import { Button, BUTTON_TYPES, BUTTON_VARIANTS } from '@/shared/components/Button'
import { BackWardIcon, PauseIcon, PlayIcon } from '@/shared/components/icons'
import { paths } from '@/shared/config/paths'

import './NotFoundView.css'

export function PageNotFoundView () {
  return (
    <div className='not-found-view container'>
      <div className='not-found-view__illustration'>
        <PlayIcon className='not-found-view__play' size={100} />
        <PauseIcon className='not-found-view__pause' size={100} />
      </div>

      <h1 className='not-found-view__title'>Page not found</h1>
      <p className='not-found-view__description'>Pause for a sec — <br /> let's go back to something that sounds right.</p>

      <Button
        replace
        as={BUTTON_TYPES.link}
        to={paths.home.build()}
        variant={BUTTON_VARIANTS.secondary}
        className='not-found-view__back-button'
      >
        <BackWardIcon className='not-found-view__backward-icon' /> Go back home
      </Button>
    </div>
  )
}
