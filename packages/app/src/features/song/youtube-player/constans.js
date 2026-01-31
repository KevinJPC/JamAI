export const PLAYER_LOADING_STATUS = {
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR',
}

export const PLAYER_ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  UNAVAILABLE: 'UNAVAILABLE',
  UNKNOWN: 'UNKNOWN'
}

export const PLAYER_ERROR_CODES_BY_YOUTUBE_INTERNAL_ERRORS = {
  100: PLAYER_ERROR_CODES.NOT_FOUND,
  101: PLAYER_ERROR_CODES.UNAVAILABLE,
  150: PLAYER_ERROR_CODES.UNAVAILABLE
}

export const UPDATE_CURRENT_TIME_FREQUENCY_MS = 100
export const COMMIT_PLAYER_TIME_UPDATE_DELAY_MS = 300
export const RELEASE_IS_SEEKING_LOCK_MS = 100

export const DEFAULT_VOLUME = { current: 0.7, previous: 0.7 }
export const MIN_AUDIBLE_VOLUME = 0.15

// React player props and callbacks: https://github.com/cookpete/react-player?tab=readme-ov-file#props
export const REACT_PLAYER_DEFAULT_PROPS_CONFIG = {
  pip: false, // disable picture-in-picture mode
  disableRemotePlayback: true, // Remote playback is when the browser allows the user to send media to: Chromecast, Smart TVs, etc

  // For responsiveness
  width: '100%',
  height: 'auto',

  controls: false,
  playsInline: true, // allow inline playback for mobile browsers instead of fullscreen only
  light: false,
  loop: false,
  playbackRate: 1,
  config: {
    // Youtube parameters docs: https://developers.google.com/youtube/player_parameters#Parameters
    youtube: {
      autoplay: false,
      fs: 0, // prevents the fullscreen button from displaying in the player
      disablekb: 1, // disable keyboard control
      iv_load_policy: 3, // dont show anotations
      cc_load_policy: 0, // dont show captions
      playsinline: 1, // allow inline playback for mobile browsers instead of fullscreen only
      rel: 0, // show related videos of the current video's channel instead of any channel
      hl: 'en', // sets interface language to english
      referrerpolicy: 'strict-origin-when-cross-origin' // recommended value by youtube docs and default in most browsers
      // see for more information: https://developers.google.com/youtube/terms/required-minimum-functionality#embedded-player-api-client-identity
    }
  }
}
