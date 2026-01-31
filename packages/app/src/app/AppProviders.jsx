import { SkeletonTheme } from 'react-loading-skeleton'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { AuthProvider } from '@/shared/auth/AuthProvider'
import { useTrackScrollbarWidthCSSProperty } from '@/shared/hooks/useTrackScrollbarWidthCSSProperty'
import { queryClient } from '@/shared/lib/queryClient'
import { Toaster } from '@/shared/toaster/Toaster'
import { UserPreferencesProvider } from '@/shared/user-preferences/UserPreferencesProvider'

export function AppProviders ({ children }) {
  useTrackScrollbarWidthCSSProperty()

  return (
    <QueryClientProvider client={queryClient}>

      <Toaster />

      <AuthProvider>

        <SkeletonTheme enableAnimation={false}>

          <UserPreferencesProvider>

            {children}

          </UserPreferencesProvider>

        </SkeletonTheme>

      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
