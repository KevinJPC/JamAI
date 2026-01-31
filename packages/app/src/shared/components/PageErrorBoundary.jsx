import { ErrorBoundaryWithQueriesReset } from '@/shared/components/ErrorBoundaryWithQueriesReset'
import { PageErrorView } from '@/shared/components/PageErrorView'
import { PageNotFoundView } from '@/shared/components/PageNotFoundView'
import { NotFoundSignal, ParamsValidationError } from '@/shared/errors'

function PageErrorFallbackRender ({ error, resetErrorBoundary }) {
  if (error instanceof NotFoundSignal || error instanceof ParamsValidationError) return <PageNotFoundView />
  return <PageErrorView onReset={resetErrorBoundary} />
}

export function PageErrorBoundary ({ children }) {
  const handleError = (error) => {
    console.log(error)
  }
  return (
    <ErrorBoundaryWithQueriesReset
      onError={handleError}
      fallbackRender={PageErrorFallbackRender}
    >
      {children}
    </ErrorBoundaryWithQueriesReset>
  )
}
