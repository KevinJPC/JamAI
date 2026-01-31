import { useMutation } from '@tanstack/react-query'

import { useAuth } from '@/shared/auth/AuthContext'
import { updatePersistedIsLoggedIn } from '@/shared/auth/authStore'
import { queryClient } from '@/shared/lib/queryClient'
import { signIn, signOut, signUp } from '@/shared/services/auth'

export function useSignInMutation () {
  const auth = useAuth()
  return useMutation({
    mutationFn: ({ email, password }) => signIn({ email, password }),
    onSuccess: (data) => {
      updatePersistedIsLoggedIn(true)
      auth.setUser(data)
      queryClient.resetQueries()
    }
  })
}

export function useSignOutMutation () {
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear()
      updatePersistedIsLoggedIn(false)
      window.location.href = '/'
    }
  })
}

export function useSignUpMutation () {
  return useMutation({
    mutationFn: ({ email, name, lastName, password }) => signUp({ email, password, name, lastName })
  })
}
