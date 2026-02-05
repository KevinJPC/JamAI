import { useCallback } from 'react'
import classNames from 'classnames'
import { Link } from 'wouter'

import { useAuth } from '@/shared/auth/AuthContext'
import { AuthModal } from '@/shared/auth/AuthModal'
import { Button } from '@/shared/components/Button'
import { Logo } from '@/shared/components/Logo'
import { ProfileMenu } from '@/shared/components/ProfileMenu'
import { SearchInput } from '@/shared/components/SearchInput'
import { UserAvatar } from '@/shared/components/UserAvatar'
import { useDialog } from '@/shared/hooks/useDialog'

import './Header.css'

export const Header = ({ sticky = false, showSearch = true, className }) => {
  const { setRef } = useHasScrolled({ enabled: sticky })
  return (
    <header
      ref={setRef}
      className={classNames('header', {
        'header--sticky': sticky,
        className
      })}
    >
      <div className='header__inner-wrapper'>
        <Link to='/'>
          <Logo />
        </Link>

        {showSearch && <SearchInput className='header__search-input' />}

        <HeaderAuth />
      </div>

    </header>
  )
}

function HeaderAuth () {
  const auth = useAuth()

  if (!auth.isAuthenticated) return <HeaderAuthButtons />

  return (
    <ProfileMenu
      renderTriggerElement={({ ref, onClick }) =>
        <Button
          className='header__user-avatar-button'
          variant='transparent' onClick={onClick} ref={ref}
        >
          <UserAvatar name={auth.user.name} lastName={auth.user.lastName} />
        </Button>}
    />
  )
}

function HeaderAuthButtons () {
  const [modal, setModal] = useDialog()

  const handleClickAuthButtons = async ({ formView }) => {
    await setModal(({ close }) => <AuthModal initialFormView={formView} onClose={close} />)
  }
  return (
    <div className='header__auth-buttons-wrapper'>
      {modal}
      <Button onClick={() => handleClickAuthButtons({ formView: 'login' })} variant='secondary'>
        Log In
      </Button>
      <Button className='header__signin-button' onClick={() => handleClickAuthButtons({ formView: 'signup' })} variant='primary'>
        Sign Up
      </Button>
    </div>
  )
}

function useHasScrolled ({ enabled }) {
  const setRefCb = useCallback((node) => {
    if (!enabled) return

    const onScroll = () => node.setAttribute('data-scrolled', (window.scrollY > 0))

    if (node) {
      document.addEventListener('scroll', onScroll)
    } else {
      document.removeEventListener('scroll', onScroll)
    }
  }, [enabled])
  return { setRef: setRefCb }
}
