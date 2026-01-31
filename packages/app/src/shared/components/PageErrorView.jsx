import { Button, BUTTON_TYPES, BUTTON_VARIANTS } from '@/shared/components/Button'
import { BackWardIcon } from '@/shared/components/icons'
import { paths } from '@/shared/config/paths'

import './PageErrorView.css'

export function PageErrorView ({ onReset }) {
  return (
    <div className='page-error-view container'>

      <h1 className='page-error-view__title'>An error had happend</h1>
      <p className='page-error-view__description'>Something went wrong, try again or come back later.</p>

      <div className='page-error-view__actions'>
        <Button
          onClick={() => onReset()}
          variant={BUTTON_VARIANTS.secondary}
          className='page-error-view__retry-button'
        >
          Try again
        </Button>

        <Button
          replace
          as={BUTTON_TYPES.link}
          to={paths.home.build()}
          variant={BUTTON_VARIANTS.secondary}
          className='page-error-view__back-button'
        >
          <BackWardIcon className='page-error-view__backward-icon' /> Go back home
        </Button>
      </div>
    </div>
  )
}
