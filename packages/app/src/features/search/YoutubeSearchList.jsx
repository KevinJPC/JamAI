import { JOB_STATUS } from '@chords-extractor/common/constants'
import Key from '@chords-extractor/common/key'
import { navigate } from 'wouter/use-browser-location'

import { POLLING_STATUS } from '@/features/search/YoutubeSearchJobManager/constants'
import { useYoutubeSearchJobManagerContext } from '@/features/search/YoutubeSearchJobManager/YoutubeSearchJobManagerContext'
import { YoutubeSearchJobManagerProvider } from '@/features/search/YoutubeSearchJobManager/YoutubeSearchJobManagerProvider'
import { useAuth } from '@/shared/auth/AuthContext'
import { AuthModal } from '@/shared/auth/AuthModal'
import { List } from '@/shared/components/List'
import { SongCard } from '@/shared/components/SongCard'
import { Spinner } from '@/shared/components/Spinner'
import { useDialog } from '@/shared/hooks/useDialog'
import { getYoutubeHqDefaultThumbnailById } from '@/shared/utils/getYoutubeThumbnailById'
import { joinWithBulletPoint } from '@/shared/utils/joinWithBulletPoint'

export function YoutubeSearchList ({ results, query }) {
  return (
    <YoutubeSearchJobManagerProvider query={query}>
      <List
        results={results}
        itemKeyFn={(result) => result.youtube.id}
        renderItem={(result) => {
          return result.isAnalyzed ? <AnalyzedYoutubeSearchResultItem result={result} /> : <NotAnalyzedYoutubeSearchResultItem result={result} />
        }}
      />
    </YoutubeSearchJobManagerProvider>
  )
}

function AnalyzedYoutubeSearchResultItem ({ result }) {
  const { songAnalysisJobPolling } = useYoutubeSearchJobManagerContext()

  const shouldDisableResultItem =
  [POLLING_STATUS.creating, POLLING_STATUS.polling, POLLING_STATUS.finished]
    .includes(songAnalysisJobPolling.status)

  const youtubeChannelName = result.song.youtubeChannel.name
  const keyLabel = `Key ${Key.getPreferredKeyLabelFromKey(result.song.defaultVersion.key)}`
  const bpmText = `${Math.round(result.song.defaultVersion.bpm)} bpm`

  const detailsText = [youtubeChannelName, keyLabel, bpmText]
  return (
    <SongCard disabled={shouldDisableResultItem}>
      <SongCard.Thumbnail id={result.song.youtubeId}>
        <SongCard.ThumbnailImg src={getYoutubeHqDefaultThumbnailById(result.song.youtubeId)} loading='lazy' />
      </SongCard.Thumbnail>
      <SongCard.Content>
        <SongCard.Title
          tooltipTitle={result.song.title}
          navigable
          to={`chords/${result.song?.id}?version=${result.song.defaultVersion.id}`}
        >
          {result.song.title}
        </SongCard.Title>
        <SongCard.Body>
          <SongCard.DetailsList tooltipTitle={joinWithBulletPoint(detailsText)}>
            {detailsText.map((detail, index) =>
              <SongCard.DetailsItem key={index}>{detail}</SongCard.DetailsItem>
            )}
          </SongCard.DetailsList>
          <SongCard.Status isAnalyzed />

        </SongCard.Body>

      </SongCard.Content>
    </SongCard>
  )
}

function NotAnalyzedYoutubeSearchResultItem ({ result }) {
  const auth = useAuth()
  const [dialog, setDialog] = useDialog()
  const { songAnalysisJobPolling } = useYoutubeSearchJobManagerContext()

  const isThisSearchResultTheAnalysisTarget = result.youtube.id === songAnalysisJobPolling.youtubeId

  const hasOrIsAnalyzingThisSearchResult =
    [POLLING_STATUS.polling, POLLING_STATUS.finished]
      .includes(songAnalysisJobPolling.status) && isThisSearchResultTheAnalysisTarget

  const isCreatingAnalysisJobForThisSearchResult = songAnalysisJobPolling.status === POLLING_STATUS.creating && isThisSearchResultTheAnalysisTarget

  const shouldDisableResultItem =
    [POLLING_STATUS.creating, POLLING_STATUS.polling, POLLING_STATUS.finished]
      .includes(songAnalysisJobPolling.status) && !isThisSearchResultTheAnalysisTarget

  const handleClickAnalyze = async () => {
    if (!auth.isAuthenticated) {
      return await setDialog(({ close }) =>
        <AuthModal initialFormView='login' onClose={close} />
      )
    }

    songAnalysisJobPolling.createJob({ youtubeId: result.youtube.id })
  }

  return (
    <>
      {dialog}
      <SongCard
        disabled={shouldDisableResultItem}
      >
        <SongCard.Thumbnail id={result.youtube.id}>
          <SongCard.ThumbnailImg src={getYoutubeHqDefaultThumbnailById(result.youtube.id)} loading='lazy' />
        </SongCard.Thumbnail>
        <SongCard.Content>
          <SongCard.Title tooltipTitle={result.youtube.title}>
            {result.youtube.title}
          </SongCard.Title>
          <SongCard.Body>
            {!hasOrIsAnalyzingThisSearchResult &&
              <>
                <SongCard.Button
                  disabled={isCreatingAnalysisJobForThisSearchResult}
                  onClick={handleClickAnalyze}
                >
                  {isCreatingAnalysisJobForThisSearchResult ? <Spinner size={14} /> : 'Analyze now'}
                </SongCard.Button>
                <SongCard.Status isAnalyzed={false} />
              </>}

            {(hasOrIsAnalyzingThisSearchResult) &&
              <>
                <SongCard.JobStatus>
                  {songAnalysisJobPolling.job.status === JOB_STATUS.waiting
                    ? <SongCard.JobStatusLoadingBar />
                    : <SongCard.JobStatusProgressBar
                        hasFinished={songAnalysisJobPolling.job.status === JOB_STATUS.completed}
                        onCompletedTransitionEnd={() => {
                          songAnalysisJobPolling.updateRelatedCacheFromJobResult()
                          navigate(`/chords/${songAnalysisJobPolling.job.result.id}?version=${songAnalysisJobPolling.job.result.defaultVersion.id}`)
                        }}
                      />}

                  <SongCard.JobStatusText jobStatus={songAnalysisJobPolling.job.status} />
                </SongCard.JobStatus>
              </>}
          </SongCard.Body>

        </SongCard.Content>
      </SongCard>
    </>

  )
}
