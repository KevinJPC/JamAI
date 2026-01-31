import classNames from 'classnames'

import { paths } from '@/shared/config/paths.js'
import { useMatchedPath } from '@/shared/hooks/useMatchedPath.js'

import { Footer } from './Footer.jsx'
import { Header } from './Header.jsx'

import './Layout.css'

const layoutOptionsByPath = {
  [paths.home.path]: {
    showSearchHeader: false,
  },
  [paths.chords.path]: {
    stickyHeader: false
  }
}
const pathsWithCustomLayoutOptions = Object.keys(layoutOptionsByPath)

export const Layout = ({ children }) => {
  const matchedPath = useMatchedPath(pathsWithCustomLayoutOptions)
  const customPathLayoutOptions = matchedPath ? layoutOptionsByPath[matchedPath] : null

  return (
    <div className={classNames('layout')}>
      <Header
        showSearch={customPathLayoutOptions?.showSearchHeader ?? true}
        sticky={customPathLayoutOptions?.stickyHeader ?? true}
      />
      <div className='mt-md'>
        {children}
      </div>
      <Footer className='mt-md' />
    </div>
  )
}
