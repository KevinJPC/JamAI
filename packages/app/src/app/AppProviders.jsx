import { SkeletonTheme } from 'react-loading-skeleton'
import { QueryClientProvider } from '@tanstack/react-query'
// eslint-disable-next-line no-unused-vars
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { AuthProvider } from '@/shared/auth/AuthProvider'
import { useTrackScrollbarWidthCSSProperty } from '@/shared/hooks/useTrackScrollbarWidthCSSProperty'
import { queryClient } from '@/shared/lib/queryClient'
import { ToastContainer } from '@/shared/toasts/ToastContainer'
import { UserPreferencesProvider } from '@/shared/user-preferences/UserPreferencesProvider'

export function AppProviders ({ children }) {
  useTrackScrollbarWidthCSSProperty()

  return (
    <QueryClientProvider client={queryClient}>

      <AuthProvider>

        <SkeletonTheme enableAnimation={false}>

          <UserPreferencesProvider>

            {children}

          </UserPreferencesProvider>

        </SkeletonTheme>

      </AuthProvider>
      <ToastContainer />

      {/* <ReactQueryDevtools initialIsOpen={false} buttonPosition='top-left' /> */}
    </QueryClientProvider>
  )
}
