import { ErrorBoundaryWithQueriesReset } from '@/shared/components/ErrorBoundaryWithQueriesReset'
import { GlobalErrorView } from '@/shared/components/GlobalErrorView'

export function AppErrorBoundary ({ children }) {
  return (
    <ErrorBoundaryWithQueriesReset
      fallbackRender={({ resetErrorBoundary }) =>
        <GlobalErrorView onReset={resetErrorBoundary} />}
    >
      {children}
    </ErrorBoundaryWithQueriesReset>
  )
}
