import { useMutation } from '@tanstack/react-query'

import { queryClient } from '../../../config/queryClient.js'
import { updatePersistedIsLoggedIn } from '../../../hooks/useUser.js'
import { logIn } from '../services/auth.js'

export function useLogIn () {
  const mutation = useMutation({
    mutationFn: ({ email, password }) => logIn({ email, password }),
    onSuccess: (data) => {
      const userQueryKey = ['user']
      updatePersistedIsLoggedIn(true)
      queryClient.setQueryData(userQueryKey, () => data)
      queryClient.resetQueries({
        predicate: (q) => {
          const queryKeyString = q.queryKey.toString()
          const shouldRemoveQuery =
          queryKeyString !== userQueryKey.toString()
          return shouldRemoveQuery
        }
      })
    },
    onError: () => {
      updatePersistedIsLoggedIn(false)
    }
  })
  return {
    status: mutation.status,
    logIn: mutation.mutate,
    error: mutation.error
  }
}
