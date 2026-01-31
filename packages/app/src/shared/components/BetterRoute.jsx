import { Route } from 'wouter'

import { PageErrorBoundary } from '@/shared/components/PageErrorBoundary'

export function BetterRoute ({ path, children, paramsParser, }) {
  return (
    <Route
      path={path}
    >
      {(params) => {
        const ChildrenWithParsedParams = withParsedParams({ element: children, paramsParser, params })
        return (
          <PageErrorBoundary>
            <ChildrenWithParsedParams />
          </PageErrorBoundary>
        )
      }}
    </Route>
  )
}

function withParsedParams ({ element, paramsParser, params }) {
  return function WrappedElement () {
    const parsedParams = paramsParser ? paramsParser(params) : undefined

    return typeof element === 'function' ? element({ params: parsedParams }) : element
  }
}
