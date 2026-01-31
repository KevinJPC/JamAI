import { ErrorBoundary } from 'react-error-boundary'
import { QueryErrorResetBoundary } from '@tanstack/react-query'

export function ErrorBoundaryWithQueriesReset ({ children, onReset, ...props }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset: resetQueries }) =>
        <ErrorBoundary
          {...props}
          onReset={() => {
            resetQueries()
            onReset?.()
          }}
        >
          {children}
        </ErrorBoundary>}
    </QueryErrorResetBoundary>
  )
}
