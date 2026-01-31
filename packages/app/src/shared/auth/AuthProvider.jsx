import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ERROR_CODES } from '@chords-extractor/common/constants'

import { AuthContext } from '@/shared/auth/AuthContext'
import { getPersistedIsLoggedIn, updatePersistedIsLoggedIn } from '@/shared/auth/authStore'
import { Spinner } from '@/shared/components/Spinner'
import { queryClient } from '@/shared/lib/queryClient'
import { getMe } from '@/shared/services/users'
import { isApiError } from '@/shared/utils/isApiError'

// storage

const unauthorizedEventType = 'unauthorized'

export function AuthProvider ({ children }) {
  const [claimToBeLoggedIn] = useState(() => getPersistedIsLoggedIn())
  const [user, setUser] = useState(() => null)
  const [isAuthenticating, setIsAutenticating] = useState(() => claimToBeLoggedIn)

  const isAuthenticated = !!user

  useEffect(() => {
    if (!claimToBeLoggedIn || isAuthenticated) return
    const getAuthenticatedUser = async () => {
      try {
        setIsAutenticating(true)
        const authenticatedUser = await getMe()
        updatePersistedIsLoggedIn(true)
        setUser(authenticatedUser)
      } catch (error) {
        if (isApiError(error, ERROR_CODES.FORBIDDEN)) {
          toast.error('Session expired.', { containerId: 'general' })
          updatePersistedIsLoggedIn(false)
          return
        }
        throw error
      } finally {
        setIsAutenticating(false)
      }
    }
    getAuthenticatedUser()
  }, [])

  useEffect(() => {
    const handleOnUnauthorized = (e) => {
      queryClient.clear()
      updatePersistedIsLoggedIn(false)
      window.location.href = '/'
    }
    document.addEventListener(unauthorizedEventType, handleOnUnauthorized)
    return () => document.removeEventListener(unauthorizedEventType, handleOnUnauthorized)
  }, [])

  if (isAuthenticating) {
    return <Spinner />
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function handleUnauthorized () {
  document.dispatchEvent(new CustomEvent(unauthorizedEventType))
}
