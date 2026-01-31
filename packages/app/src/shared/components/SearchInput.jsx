import classNames from 'classnames'

import { Button } from '@/shared/components/Button'
import { SearchIcon } from '@/shared/components/icons'
import { paths } from '@/shared/config/paths'
import { useLocation } from '@/shared/hooks/useLocation'
import { useRouteSearchParams } from '@/shared/hooks/useRouteSearchParams'

import './SearchInput.css'

export const SearchInput = ({ className, autoFocus = false }) => {
  const [, navigate] = useLocation()
  const [{ q }] = useRouteSearchParams(paths.search, { strict: false })

  const handleSubmit = (e) => {
    e.preventDefault()
    const search = e.target.search.value
    navigate(paths.search.build({ search: { q: search } }))
  }

  return (
    <search className={classNames('search', className)}>
      <form onSubmit={handleSubmit} className='search__form'>
        <input
          key={`search:${q || ''}`} // rerender element when q changes setting it default (initial) value
          defaultValue={q}
          className='search__input'
          name='search'
          type='text'
          placeholder='Search'
        />
        <Button type='submit' onSubmit={handleSubmit} variant='transparent' className='search__button'>
          <SearchIcon className='search__icon' />
        </Button>
      </form>
    </search>
  )
}
