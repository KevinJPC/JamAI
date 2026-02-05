import { useState } from 'react'
import { toast } from 'react-toastify'
import classNames from 'classnames'

import { useRateVersion } from '@/features/song/queries'
import { useAuth } from '@/shared/auth/AuthContext'
import { AuthModal } from '@/shared/auth/AuthModal'
import { Button } from '@/shared/components/Button'
import { StarIcon } from '@/shared/components/icons'
import { useDialog } from '@/shared/hooks/useDialog'
import { GENERAL_CONTAINER_ID } from '@/shared/toasts/constants'

import './VersionRatingControl.css'

const STARS_BUTTONS_COUNT = 5

const RATING_TEXT_DESCRIPTION = {
  1: 'Can’t play with this',
  2: 'Not very helpful',
  3: 'Playable',
  4: 'Good to play with',
  5: 'Perfect to play along',
}

export function VersionRatingControl ({ className, currentUserRating, songId, versionId }) {
  const auth = useAuth()
  const rateVersionMutation = useRateVersion()
  const [dialog, setDialog] = useDialog()
  const [ratingHovered, setRatingHovered] = useState(() => null)

  const isPending = rateVersionMutation.isPending
  const optimisticRatingValue = isPending ? rateVersionMutation.variables.rating : currentUserRating

  const handleRating = (newRating) => {
    if (newRating === currentUserRating) return
    if (!auth.isAuthenticated) return setDialog(({ close }) => <AuthModal onClose={close} />)
    rateVersionMutation.mutate({ songId, versionId, rating: newRating }, {
      onError: () => {
        toast.error('Error rating version', { containerId: GENERAL_CONTAINER_ID })
      }
    })
  }

  const handleHoverStarButton = (number) => {
    if (number === ratingHovered) return
    setRatingHovered(number)
  }

  const handleMouseLeaveStarsWrapper = () => {
    setRatingHovered(null)
  }

  const ratingValueToShow = ratingHovered ?? optimisticRatingValue

  const ratingTextDescription = ratingValueToShow ? RATING_TEXT_DESCRIPTION[ratingValueToShow] : 'Choose your rating'

  return (
    <>
      {dialog}
      <div className={classNames('version-rating-control', className)}>

        <div
          className='version-rating-control__stars-wrapper'
          onMouseLeave={handleMouseLeaveStarsWrapper}
        >
          {new Array(STARS_BUTTONS_COUNT).fill(null)
            .map((_, index) => {
              const currentStarIndex = index + 1
              const isFilled = ratingValueToShow ? (ratingValueToShow / currentStarIndex) >= 1 : false
              return (
                <StarButton
                  isFilled={isFilled}
                  key={index} disabled={isPending}
                  onClick={() => handleRating(currentStarIndex)}
                  onMouseOver={() => handleHoverStarButton(currentStarIndex)}
                />
              )
            }
            )}
        </div>
        <p className='version-rating-control__description'>{ratingTextDescription}</p>

      </div>
    </>
  )
}

function StarButton ({ onClick, disabled, isFilled, ...props }) {
  return (
    <Button
      {...props}
      className={classNames('version-rating-control__star-button', {
        'version-rating-control__star-button--filled': isFilled
      })}
      variant='transparent'
      onClick={onClick}
      disabled={disabled}
    >
      <StarIcon filled={isFilled} size={22} />
    </Button>
  )
}
