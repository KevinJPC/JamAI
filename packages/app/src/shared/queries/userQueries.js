import { useMutation } from '@tanstack/react-query'

import { useAuth } from '@/shared/auth/AuthContext'
import { updateUser } from '@/shared/services/users'

export const userKeys = {
  all: ['user'],
  favoriteSongs: () => [...userKeys.all, 'favorite-songs'],
  userVersions: () => [...userKeys.all, 'versions']
}

export function useUpdateUserMutation () {
  const auth = useAuth()

  return useMutation({
    mutationFn: ({ name, lastName }) => updateUser({ name, lastName }),
    onSuccess: (_data, { name, lastName }) => {
      auth.setUser({ ...auth.user, name, lastName })
    }

  })
}
