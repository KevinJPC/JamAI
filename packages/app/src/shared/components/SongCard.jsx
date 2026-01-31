import { createContext } from 'react'
import { JOB_STATUS } from '@chords-extractor/common/constants'
import classNames from 'classnames'

import { Button } from '@/shared/components/Button'
import { DetailsList } from '@/shared/components/DetailsList'
import { FakeProgressBar } from '@/shared/components/FakeProgressBar'
import { Link } from '@/shared/components/Link'
import { LoadingBar } from '@/shared/components/LoadingBar'
import { useRequiredContext } from '@/shared/hooks/useRequiredContext'

import './SongCard.css'

const SongCardContext = createContext(null)

function useSongCardContext () {
  return useRequiredContext(SongCardContext)
}

export const SongCard = ({ children, disabled = false, ...props }) => {
  return (
    <SongCardContext.Provider value={{ disabled }}>

      <article
        className={classNames('audio-card clickable-card', {
          'audio-card--disabled': disabled
        })}
        {...props}
      >
        {children}
      </article>
    </SongCardContext.Provider>
  )
}

SongCard.Thumbnail = ({ children, id, ...props }) => {
  return (
    <picture id='audio-card-picture' className='audio-card__thumbnail' {...props}>
      {children}
    </picture>
  )
}

SongCard.ThumbnailImg = ({ src, ...props }) => {
  return (
    <img src={src} className='audio-card__img' {...props} />
  )
}

SongCard.Content = ({ children, ...props }) => {
  return (
    <div className='audio-card__content' {...props}>
      {children}
    </div>
  )
}

SongCard.Title = ({ children, tooltipTitle, className, navigable, to, ...props }) => {
  const { disabled } = useSongCardContext()
  return (
    <h1 {...props} className={classNames('audio-card__title')} title={tooltipTitle}>
      {navigable && !disabled
        ? (
          <Link {...props} to={to} className={classNames('audio-card__title-link clickable-card__primary-action', className)}>
            {children}
          </Link>
          )
        : children}
    </h1>
  )
}

SongCard.Body = ({ children, ...props }) => {
  return (
    <div className='audio-card__body' {...props}>
      {children}
    </div>
  )
}

SongCard.DetailsList = ({ children, tooltipTitle }) => {
  return (
    <DetailsList className='audio-card__details' tooltipTitle={tooltipTitle}>
      {children}
    </DetailsList>
  )
}

SongCard.DetailsItem = ({ children }) => {
  return (
    <DetailsList.Item>
      {children}
    </DetailsList.Item>
  )
}

SongCard.Status = ({ isAnalyzed, ...props }) => {
  const statusText = isAnalyzed ? 'Analyzed' : 'Not analyzed'
  return (
    <footer
      className={classNames('audio-card__status', {
        'audio-card__status--analyzed': isAnalyzed,
        'audio-card__status--not-analyzed': !isAnalyzed
      })}
      {...props}
    >
      <span>
        {statusText}
      </span>
    </footer>
  )
}

SongCard.Button = ({ children, disabled, ...props }) => {
  const { disabled: cardIsDisabled } = useSongCardContext()

  return (
    <Button variant='secondary' className='audio-card__analyze-button' disabled={disabled || cardIsDisabled} {...props}>
      {children}
    </Button>
  )
}

SongCard.JobStatus = ({ children }) => {
  return (
    <div className='audio-card__job-status'>
      {children}
    </div>
  )
}

SongCard.JobStatusLoadingBar = () => <LoadingBar />

SongCard.JobStatusProgressBar = ({ hasFinished, onCompletedTransitionEnd }) => (
  <FakeProgressBar
    hasFinished={hasFinished}
    className='audio-card__job-progress-bar'
    onCompletedTransitionEnd={onCompletedTransitionEnd}
  />
)

SongCard.JobStatusText = ({ jobStatus }) => {
  const jobStatusText = (() => {
    if (jobStatus === JOB_STATUS.completed) return 'Redirecting'
    if (jobStatus === JOB_STATUS.processing) return 'Processing'
    if (jobStatus === JOB_STATUS.waiting) return 'In queue'
    return 'error'
  })()
  return (
    <div className='audio-card__job-status-text'>{jobStatusText}</div>
  )
}
