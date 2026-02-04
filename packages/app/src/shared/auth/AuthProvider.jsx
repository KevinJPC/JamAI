import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ERROR_CODES } from '@chords-extractor/common/constants'
import { useQuery } from '@tanstack/react-query'

import { AuthContext } from '@/shared/auth/AuthContext'
import { getPersistedIsLoggedIn, getPersistedSessionExpired, updatePersistedIsLoggedIn, updatePersistedSessionExpired } from '@/shared/auth/authStore'
import { Spinner } from '@/shared/components/Spinner'
import { queryClient } from '@/shared/lib/queryClient'
import { getMe } from '@/shared/services/users'
import { isApiError } from '@/shared/utils/isApiError'

// storage

const unauthorizedEventType = 'unauthorized'

export function AuthProvider ({ children }) {
  const userKey = ['me']
  const userQuery = useQuery({
    queryKey: userKey,
    queryFn: () => {
      const claimToBeLoggedIn = getPersistedIsLoggedIn()
      if (!claimToBeLoggedIn) return null
      return getMe()
    },
    staleTime: Infinity,
    throwOnError: (error) => {
      return (!isApiError(error, ERROR_CODES.FORBIDDEN))
    }
  })

  const setUser = (data) => {
    queryClient.setQueryData(userKey, data)
  }

  const [lastSessionHasExpired] = useState(getPersistedSessionExpired)

  useEffect(() => {
    if (!lastSessionHasExpired) return
    toast.error('Session expired.', { containerId: 'general' })
    updatePersistedSessionExpired(false)
  }, [])

  useEffect(() => {
    const handleOnUnauthorized = (e) => {
      queryClient.clear()
      updatePersistedSessionExpired(true)

      updatePersistedIsLoggedIn(false)
      window.location.href = '/'
    }
    document.addEventListener(unauthorizedEventType, handleOnUnauthorized)
    return () => document.removeEventListener(unauthorizedEventType, handleOnUnauthorized)
  }, [])

  if (userQuery.isPending) {
    return <Spinner />
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!userQuery.data, user: userQuery.data, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function handleUnauthorized () {
  document.dispatchEvent(new CustomEvent(unauthorizedEventType))
}
