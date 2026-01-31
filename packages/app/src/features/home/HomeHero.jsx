import { SearchInput } from '@/shared/components/SearchInput'

import './HomeHero.css'

export function HomeHero () {
  return (
    <div className='landing__content'>
      <h1 className='landing__title'>
        Jam<span className='landing__accent'>AI</span>
      </h1>

      <p className='landing__description'>
        <strong className='landing__description-accent'>AI-powered chord extraction</strong>.
        Turn YouTube songs into a jam session. <strong className='landing__description-accent'>Play along,</strong> explore user versions, create your own—and more!
      </p>

      <SearchInput className='lading__search' />
    </div>
  )
}
