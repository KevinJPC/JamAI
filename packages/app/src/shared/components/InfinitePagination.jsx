import classNames from 'classnames'

import { Button, BUTTON_VARIANTS } from '@/shared/components/Button.jsx'

import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js'

import './InfinitePagination.css'

export function InfinitePagination ({ className, isLoadingNextPage, isLoadingNextPageError = false, hasNextPage, loadMoreFn, children }) {
  const observableRef = useIntersectionObserver({
    onIntersect: () => {
      if (isLoadingNextPageError || !hasNextPage || isLoadingNextPage) return
      loadMoreFn?.()
    }
  })

  if (!hasNextPage) return

  if (isLoadingNextPageError && !isLoadingNextPage) {
    return (
      <div className={classNames('infinite-pagination-wrapper infinite-pagination-wrapper--error', className)}>
        <span className='infinite-pagination__error-message'>There was an error loading results</span>
        <Button variant={BUTTON_VARIANTS.secondary} onClick={loadMoreFn}> Try again </Button>
      </div>
    )
  }

  return (
    <div className={classNames(className, 'infinite-pagination-wrapper')} ref={observableRef}>
      {children}
    </div>
  )
}
