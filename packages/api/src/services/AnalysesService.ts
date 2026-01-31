import { InvalidYoutubeIdError, NotFoundError, YoutubeVideoTooLongError } from '../errors.js'
import config from '../config.js'
import { youtubeClient } from '../lib/YoutubeClient.js'
import { analysesQueue } from '../lib/analysesQueue.js'
import { JOB_STATUS } from '@chords-extractor/common/constants'
import { CreateYoutubeVideoAnalysisJobInput, GetYoutubeVideoAnalysisJobQuery, JobResponse } from '../types/analyses.js'
import { JobState } from 'bullmq'
import { parseKnown } from '../utils/parseKnown.js'
import { jobResponseSchema } from '../schemas/analyses.js'

const MAX_YOUTUBE_VIDEO_DURATION = 900 // secs

export class AnalysesService {
  static async createYoutubeVideoAnalysisJob (input: CreateYoutubeVideoAnalysisJobInput): Promise<JobResponse> {
    const overrideIfExists = config.env === 'development' && input.overrideIfExists // only work in dev

    // the worker does validate the youtube video so the consumer doesnt waste api quota
    const video = (await youtubeClient().listMusicalVideos({ youtubeIds: [input.youtubeId] }))?.[0]

    if (!video) throw new InvalidYoutubeIdError()
    if (video.duration > MAX_YOUTUBE_VIDEO_DURATION) throw new YoutubeVideoTooLongError()

    const jobId = video.id
    const jobData = { video, overrideIfExists }

    // if a job with this id already exist in any state it doesnt add it
    const jobState = await analysesQueue().getJobState(jobId)

    // note that the jobId is being used instead of job.id seems `id` is optional
    // this maybe the why: https://github.com/taskforcesh/bullmq/discussions/388#discussioncomment-331187

    // job doesnt exist
    if (jobState === 'unknown') {
      await analysesQueue().add('analysis', jobData, { jobId })
      return parseKnown(jobResponseSchema, { id: jobId, status: JOB_STATUS.waiting, result: null })
    }

    if (overrideIfExists && (jobState === 'completed' || jobState === 'failed')) {
      const job = await analysesQueue().getJob(jobId)
      if (!job) throw new Error('Could not create job')
      await job.updateData(jobData)
      await job.retry(jobState)
      return parseKnown(jobResponseSchema, { id: jobId, status: JOB_STATUS.waiting, result: null })
    }

    if (jobState === 'completed') {
      const job = await analysesQueue().getJob(jobId)
      if (!job) throw new Error('Could not create job')
      return parseKnown(jobResponseSchema, { id: jobId, status: JOB_STATUS.completed, result: job.returnvalue })
    }

    return parseKnown(jobResponseSchema, { id: jobId, status: this.jobStateToResponseStatus(jobState), result: null })
  }

  static async getYoutubeVideoAnalysisJob (query: GetYoutubeVideoAnalysisJobQuery): Promise<JobResponse> {
    const jobState = await analysesQueue().getJobState(query.id)

    // job doesnt exist
    if (jobState === 'unknown') throw new NotFoundError()

    let returnvalue = null
    if (jobState === 'completed') {
      // there's a posibility job get cleaned up just after retriving its state and
      // then no longer exists on the queue so return undefined,
      // the bullmq api does not provide a way to get job and its state in one call
      const job = await analysesQueue().getJob(query.id)
      if (!job) throw new NotFoundError()
      returnvalue = job.returnvalue
    }

    return parseKnown(jobResponseSchema, { id: query.id, status: this.jobStateToResponseStatus(jobState), result: returnvalue })
  }

  private static jobStateToResponseStatus (jobState: JobState): JobResponse['status'] {
    switch (jobState) {
      case 'waiting': case 'delayed':
        return JOB_STATUS.waiting
      case 'active': case 'prioritized': case 'waiting-children':
        return JOB_STATUS.processing
      case 'failed': return JOB_STATUS.failed
      case 'completed': return JOB_STATUS.completed
    }
  }
}
