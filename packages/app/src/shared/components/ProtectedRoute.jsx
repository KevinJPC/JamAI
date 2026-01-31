import { Redirect } from 'wouter'

import { useAuth } from '@/shared/auth/AuthContext'

export function ProtectedRoute ({ children, redirectTo = '/' }) {
  const auth = useAuth()
  if (!auth.isAuthenticated) return <Redirect to={redirectTo} replace />
  return children
}
