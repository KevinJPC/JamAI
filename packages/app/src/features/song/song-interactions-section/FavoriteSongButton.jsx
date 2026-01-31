import { toast } from 'react-toastify'
import classNames from 'classnames'

import { useToggleFavoriteSongMutation } from '@/features/song/queries'
import { useAuth } from '@/shared/auth/AuthContext'
import { AuthModal } from '@/shared/auth/AuthModal'
import { Button } from '@/shared/components/Button'
import { HeartIcon } from '@/shared/components/icons'
import { useDialog } from '@/shared/hooks/useDialog'

import './FavoriteSongButton.css'

export function FavoriteSongButton ({ className, favoritesCount, userHasFavorited, songId, iconSize = 22 }) {
  const [dialog, setDialog] = useDialog()
  const auth = useAuth()

  const toggleSongFavoriteMutation = useToggleFavoriteSongMutation()

  const handleOnClick = () => {
    if (!auth.isAuthenticated) return setDialog(({ close }) => <AuthModal onClose={close} />)
    toggleSongFavoriteMutation.mutate({ songId, favorited: !userHasFavorited }, {
      onError: (_err, variables) => {
        toast.error(`Error ${variables.favorited ? 'saving' : 'deleting'} favorite`, { containerId: 'general' })
      }
    })
  }

  const updateIsPending = toggleSongFavoriteMutation.isPending

  const optimisticUserHasFavorited = updateIsPending
    ? toggleSongFavoriteMutation.variables.favorited
    : userHasFavorited
  const optimisticFavoritesCount = updateIsPending
    ? favoritesCount + (optimisticUserHasFavorited ? 1 : -1)
    : favoritesCount

  return (
    <>
      {dialog}
      <Button
        variant='secondary'
        className={classNames(className, 'favorite-song-button')}
        onClick={handleOnClick}
        disabled={updateIsPending}
      >
        <HeartIcon width={iconSize} solid={optimisticUserHasFavorited} />
        {optimisticFavoritesCount}
      </Button>
    </>
  )
}
