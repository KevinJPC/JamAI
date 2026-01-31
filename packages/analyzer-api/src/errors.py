from werkzeug.exceptions import HTTPException

class YoutubeDownloadError(HTTPException):
    code = 503
    description = 'An error happend downloading youtube audio'

class YoutubeVideoNotAvailable(HTTPException):
    code = 424
    description = 'Youtube video is not available'