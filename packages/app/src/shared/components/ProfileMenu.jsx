import { useState } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'wouter'

import { useSignOutMutation } from '@/shared/auth/queries'
import { Button } from '@/shared/components/Button'
import { PopOver } from '@/shared/components/PopOver'
import { paths } from '@/shared/config/paths'
import { GENERAL_CONTAINER_ID } from '@/shared/toasts/constants'

import './ProfileMenu.css'

export function ProfileMenu ({ renderTriggerElement }) {
  const [isOpen, setIsOpen] = useState()

  const handleOnClickLink = () => {
    setIsOpen(false)
  }

  return (
    <PopOver
      isOpen={isOpen}
      onIsOpenChange={setIsOpen}
      placement='bottom-start'
      offset={8}
    >
      <PopOver.Trigger renderElement={(...props) => renderTriggerElement(...props)} />
      <PopOver.Content>
        <menu className='profile-menu'>
          <li className='profile-menu__item' onClick={handleOnClickLink}>
            <Link className='profile-menu__item-action' to={paths.me.versions.build()}>Versions</Link>
          </li>
          <li className='profile-menu__item' onClick={handleOnClickLink}>
            <Link className='profile-menu__item-action' to={paths.me.favorites.build()}>Favorites</Link>
          </li>
          <li className='profile-menu__item' onClick={handleOnClickLink}>
            <Link className='profile-menu__item-action' to={paths.me.build()}>Settings</Link>
          </li>
          <li className='profile-menu__item'>
            <SignOutButton className='profile-menu__item-action' />
          </li>
        </menu>
      </PopOver.Content>
    </PopOver>
  )
}

function SignOutButton ({ className }) {
  const signOutMutation = useSignOutMutation()

  const handleOnClick = () => {
    signOutMutation.mutate(null, {
      onError: (err) => {
        console.log(err)
        toast.error('Error loggin out', { containerId: GENERAL_CONTAINER_ID })
      }
    })
  }
  return (
    <Button
      variant='transparent'
      className={className}
      onClick={handleOnClick}
      disabled={signOutMutation.isPending}
    >
      Sign out
    </Button>
  )
}
