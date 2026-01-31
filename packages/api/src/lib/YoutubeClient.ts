import iso8601 from 'iso8601-duration'
import { decodeHTML } from 'entities'
// eslint-disable-next-line camelcase
import { youtube, youtube_v3 } from '@googleapis/youtube'

class YoutubeClient {
  // eslint-disable-next-line camelcase
  #wrappedYoutubeClient: youtube_v3.Youtube | null
  #MUSIC_VIDEO_CATEGORY_ID = '10'

  constructor (key: string) {
    this.#wrappedYoutubeClient = youtube({
      version: 'v3',
      auth: key
    })
  }

  private wrappedYoutubeClient () {
    if (this.#wrappedYoutubeClient === null) throw new Error('You must call intialized and provide an api key before using the YoutubeClient')
    return this.#wrappedYoutubeClient
  }

  async searchMusicalVideos ({ query }: { query: string }): Promise<YoutubeVideo[]> {
    const response = await this.wrappedYoutubeClient().search.list({
      part: ['snippet', 'id'],
      q: query,
      type: ['video'],
      videoCategoryId: this.#MUSIC_VIDEO_CATEGORY_ID,
      maxResults: 15,
    })

    // response still includes others results that are not video results, even after setting `type` param to `video` as youtube api docs specify
    // For example after making next req you might notice a channel result type in the items
    // https:// youtube.googleapis.com/youtube/v3/search?part=id&type=video&q=alex+warren&key=[APIKEY]
    // thats the reason items are being filter

    const videoResults = response.data.items?.filter(result => result.id?.videoId)

    /*
      Checks for undefined on many properties because the type definitions of several
      Google client services for node (YouTube included) are incorrect or out of sync with the
      actual API documentation.

      Related issues:
      https://github.com/googleapis/google-api-nodejs-client/issues/3542
      https://github.com/googleapis/google-api-nodejs-client/issues/3151
    */
    const results = videoResults?.map<YoutubeVideo>(result => {
      if (!result.id?.videoId ||
        !result.snippet?.title ||
        !result.snippet.channelId ||
        !result.snippet.channelTitle) {
        throw new Error('Missing data from youtube result')
      }
      return {
        id: result.id.videoId,
        // YouTube's API returns titles with HTML entities (e.g., ).
        // The `decodeHTML` function is used here to decode these entities and display the title correctly.
        title: decodeHTML(result.snippet.title),
        channel: {
          id: result.snippet.channelId,
          name: decodeHTML(result.snippet.channelTitle)
        }
      }
    }) ?? []

    return results
  }

  async listMusicalVideos ({ youtubeIds }: { youtubeIds: string[] }): Promise<YoutubeVideoWithDuration[]> {
    const response = await this.wrappedYoutubeClient().videos.list({
      part: ['snippet', 'contentDetails',],
      id: youtubeIds,
    })

    const musicalResults = response.data.items?.filter(item => item.snippet?.categoryId === this.#MUSIC_VIDEO_CATEGORY_ID)
    const results = musicalResults?.map<YoutubeVideoWithDuration>(result => {
      if (!result.id ||
        !result.snippet?.title ||
        !result.snippet.channelId ||
        !result.snippet.channelTitle ||
        !result.contentDetails?.duration) throw new Error('Missing data from youtube result')

      return {
        id: result.id,
        // YouTube's API returns titles with HTML entities (e.g., "&amp;").
        // The `decodeHTML` function is used here to decode these entities and display the title correctly.
        title: decodeHTML(result.snippet.title),
        channel: {
          id: result.snippet.channelId,
          name: decodeHTML(result.snippet.channelTitle)
        },
        duration: iso8601.toSeconds(iso8601.parse(result.contentDetails.duration)),
      }
    }) ?? []

    return results
  }
}

export type YoutubeVideo = {
  id: string,
  title: string,
  channel: {
    id: string,
    name: string
  }
}

export type YoutubeVideoWithDuration = YoutubeVideo & { duration: number }

let _youtubeClient: YoutubeClient | null = null

export function youtubeClient () {
  if (!_youtubeClient) throw new Error('Youtube client instance has not been initialized.')
  return _youtubeClient
}

export function setupYoutubeClient (key: string) {
  _youtubeClient = new YoutubeClient(key)
}
