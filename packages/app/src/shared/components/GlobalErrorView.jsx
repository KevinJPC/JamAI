import { Button, BUTTON_VARIANTS } from '@/shared/components/Button'
import { BackWardIcon } from '@/shared/components/icons'
import { paths } from '@/shared/config/paths'

import './GlobalErrorView.css'

export function GlobalErrorView ({ onReset }) {
  return (
    <main className='global-error-view container'>

      <h1 className='global-error-view__title'>An error had happend</h1>
      <p className='global-error-view__description'>Something went wrong, try again or come back later.</p>

      <div className='global-error-view__actions'>
        <Button
          onClick={() => onReset()}
          variant={BUTTON_VARIANTS.secondary}
          className='global-error-view__retry-button'
        >
          Try again
        </Button>

        <Button
          onClick={() => {
            window.location.replace(paths.home.build())
          }}
          variant={BUTTON_VARIANTS.secondary}
          className='global-error-view__back-button'
        >
          <BackWardIcon className='global-error-view__backward-icon' /> Go back home
        </Button>
      </div>
    </main>
  )
}
