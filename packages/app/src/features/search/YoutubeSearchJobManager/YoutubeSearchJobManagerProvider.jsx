import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { ERROR_CODES, JOB_STATUS } from '@chords-extractor/common/constants'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createAnalysisJob, getAnalysisJob } from '@/features/search/services/jobs'
import { POLLING_STATUS } from '@/features/search/YoutubeSearchJobManager/constants'
import { YoutubeSearchJobManagerContext } from '@/features/search/YoutubeSearchJobManager/YoutubeSearchJobManagerContext'
import { songKeys } from '@/shared/queries/songQueries'
import { GENERAL_CONTAINER_ID } from '@/shared/toasts/constants'
import { isApiError } from '@/shared/utils/isApiError'

const checkShouldPolling = (jobStatus) => {
  const shouldPolling = [JOB_STATUS.waiting, JOB_STATUS.processing].includes(jobStatus)
  return shouldPolling
}
const POLLING_DELAY_MS = 5000

function customCheckShouldThrowOnError (error) {
  if (!isApiError(error)) return true
  if (error.errorCode === ERROR_CODES.FEATURE_UNAVAILABLE) return false
  if (error.statusCode >= 500) return true
  return false
}

const useCreateSongAnalysisJobPolling = ({ q = null }) => {
  const queryClient = useQueryClient()
  const createJobMutation = useMutation({
    mutationKey: ['job'],
    mutationFn: ({ youtubeId }) => createAnalysisJob({ youtubeId }),
    onSuccess: async (job) => {
      queryClient.setQueryData(['job', job.id], job, {})
    },
    throwOnError: customCheckShouldThrowOnError,
  })

  const jobQuery = useQuery({
    queryKey: createJobMutation.data ? ['job', createJobMutation.data.id] : undefined,
    queryFn: () => getAnalysisJob({ id: createJobMutation.data.id }),
    enabled: createJobMutation.isSuccess,
    staleTime: POLLING_DELAY_MS,
    refetchInterval: (query) => {
      if (query.state.status === 'error' ||
        (query.state.status === 'success' && !checkShouldPolling(query.state.data.status))
      ) return false

      return POLLING_DELAY_MS
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    throwOnError: customCheckShouldThrowOnError
  })

  const job = jobQuery.data

  const pollingError = createJobMutation.error ?? jobQuery.error

  const getDerivedPollingStatus = () => {
    if (createJobMutation.isPending) return POLLING_STATUS.creating
    if (createJobMutation.isError ||
      jobQuery.isError ||
      (jobQuery.isSuccess && job.status === JOB_STATUS.failed)) return POLLING_STATUS.failed
    if (jobQuery.isSuccess && checkShouldPolling(job.status)) return POLLING_STATUS.polling
    if (jobQuery.isSuccess && job.status === JOB_STATUS.completed) return POLLING_STATUS.finished
    return POLLING_STATUS.idle
  }
  const pollingStatus = getDerivedPollingStatus()

  useEffect(() => {
    if (!pollingStatus === POLLING_STATUS.finished) return
    invalidatedLatestSongs(queryClient)
  }, [pollingStatus])

  const runMutation = ({ youtubeId }) => {
    createJobMutation.reset()
    createJobMutation.mutate({ youtubeId })
  }

  const updateRelatedCacheFromJobResult = () => {
    if (!pollingStatus === POLLING_STATUS.finished) return
    updateYoutubeSearchCachedDataFromJobResult({ q, job }, queryClient)
  }

  return { job, error: pollingError, status: pollingStatus, createJob: runMutation, youtubeId: createJobMutation.variables?.youtubeId, updateRelatedCacheFromJobResult }
}

const updateYoutubeSearchCachedDataFromJobResult = ({ q, job }, queryClient) => {
  const newAnalyzedSongSummaryResponse = {
    id: job.result.id,
    youtubeId: job.result.youtubeId,
    title: job.result.title,
    youtubeChannel: {
      id: job.result.youtubeChannel.id,
      name: job.result.youtubeChannel.name
    },
    defaultVersion: {
      id: job.result.defaultVersion.id,
      bpm: job.result.defaultVersion.bpm,
      key: {
        mode: job.result.defaultVersion.key.mode,
        pitchClass: job.result.defaultVersion.key.pitchClass
      },
    },
    duration: job.result.duration
  }
  queryClient.setQueryData(['search', q], (oldSearchData) => {
    if (!oldSearchData || !oldSearchData.results) return oldSearchData

    const resultIndexToUpdate = oldSearchData.results.findIndex(r => r.youtube.id === newAnalyzedSongSummaryResponse.youtubeId)
    if (resultIndexToUpdate === -1) return oldSearchData

    const newSearchData = { ...oldSearchData }
    newSearchData.results[resultIndexToUpdate] = { ...newSearchData.results[resultIndexToUpdate], isAnalyzed: true, song: newAnalyzedSongSummaryResponse }
    return newSearchData
  })
}

const invalidatedLatestSongs = async (queryClient) => {
  queryClient.invalidateQueries({ queryKey: songKeys.list(), exact: true })
}

export function YoutubeSearchJobManagerProvider ({ children, query }) {
  const songAnalysisJobPolling = useCreateSongAnalysisJobPolling({ q: query })

  useEffect(() => {
    if (songAnalysisJobPolling.status !== POLLING_STATUS.failed) return
    const errorMessage = songAnalysisJobPolling.error?.message ?? 'We cannot analyze this song right now'
    toast.error(errorMessage, { containerId: GENERAL_CONTAINER_ID })
  }, [songAnalysisJobPolling.status])

  return (
    <YoutubeSearchJobManagerContext.Provider value={{ songAnalysisJobPolling }}>
      {children}
    </YoutubeSearchJobManagerContext.Provider>
  )
}
