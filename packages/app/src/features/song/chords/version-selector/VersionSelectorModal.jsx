import { useState } from 'react'
import classNames from 'classnames'
import { Link } from 'wouter'

import { useSongVersions } from '@/features/song/queries'
import { Button } from '@/shared/components/Button'
import { CustomSkeleton } from '@/shared/components/CustomSkeleton'
import { ChevronDownIcon } from '@/shared/components/icons'
import { InfinitePagination } from '@/shared/components/InfinitePagination'
import { List } from '@/shared/components/List'
import { Logo } from '@/shared/components/Logo'
import { Modal } from '@/shared/components/Modal'
import { RatingSummary } from '@/shared/components/RatingSummary'
import { UserAvatar, UserAvatarSkeleton } from '@/shared/components/UserAvatar'
import { paths } from '@/shared/config/paths'

import './VersionSelector.css'
import './SongVersionsList.css'

export function VersionSelector ({ currentVersion, onExit }) {
  const [isOpen, setIsOpen] = useState(false)

  const songVersionsQuery = useSongVersions({ songId: currentVersion.songId, enabled: isOpen })

  const handleOnNavigateToVersion = (data) => {
    setIsOpen(false)
  }

  const buttonText = currentVersion.isSystemVersion ? "System's version" : `${currentVersion.user.name}'s version`

  return (
    <Modal isOpen={isOpen} onIsOpenChange={setIsOpen} onExit={onExit}>
      <Modal.Backdrop />
      <Modal.Trigger renderElement={({ onClick }) => (
        <Button
          className='version-selector-modal__button'
          variant='transparent'
          onClick={onClick}
        >
          <span
            className='version-selector-modal__button-text'
          >{buttonText}
          </span> <ChevronDownIcon width={16} strokeWidth={3} />
        </Button>
      )}
      />
      <Modal.Content>
        <Modal.Header>Select a song version
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body className='version-selector-modal__body'>
          {songVersionsQuery.isPending && <SongVersionsListSkeleton count={7} />}
          {songVersionsQuery.data && (
            <>
              <List
                className={classNames('song-version-list')}
                results={songVersionsQuery.data}
                itemKeyFn={(version) => version.id}
                renderItem={(version) => {
                  return (
                    <SongVersionItem
                      version={version}
                      isCurrent={currentVersion.id === version.id}
                      onNavigate={handleOnNavigateToVersion}
                    />
                  )
                }}
              />
              <InfinitePagination
                hasNextPage={songVersionsQuery.hasNextPage}
                loadMoreFn={songVersionsQuery.fetchNextPage}
                isLoadingNextPage={songVersionsQuery.isFetchingNextPage}
              >
                <SongVersionsListSkeleton
                  className='version-selector-modal__infinity-scroll-skeleton'
                />
              </InfinitePagination>
            </>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

function SongVersionItem ({ version, isCurrent, onNavigate }) {
  const title = version.isSystemVersion ? 'JamAI\'s version' : `${version.user.name}'s version`
  return (
    <article className={classNames('version-card clickable-card', {
      'version-card--selected': isCurrent
    })}
    >
      {!version.isSystemVersion
        ? <UserAvatar
            name={version.user.name}
            lastName={version.user.lastName}
          />
        : <Logo />}

      <div className='version-card__content'>
        <h1 className='version-card__title line-clamp-1'>
          <Link
            className='clickable-card__primary-action'
            to={paths.chords.build({ params: { songId: version.songId }, search: { version: version.id } })}
            replace
            onClick={() => onNavigate(version.id)}
          >

            {title}
          </Link>

        </h1>

        <RatingSummary
          className='version-card__rating'
          ratingAverage={version.ratingAverage}
          ratingCount={version.ratingCount}
        />
      </div>
    </article>
  )
}

export function SongVersionsListSkeleton ({ count = 1, className }) {
  return (
    <List
      className={classNames('song-version-list', className)}
      results={new Array(count).fill(null)}
      renderItem={() => (
        <div className={classNames('version-card')}>
          <UserAvatarSkeleton />
          <div className='version-card__content'>
            <CustomSkeleton maxWidth='300px' flexContainer height='14px' />
          </div>
        </div>
      )}
      itemKeyFn={(_, index) => index}
    />
  )
}
