import yt_dlp
from yt_dlp.utils import DownloadError, UnavailableVideoError
from errors import YoutubeDownloadError, YoutubeVideoNotAvailable
import os


# https://github.com/yt-dlp/yt-dlp?tab=readme-ov-file#extract-audio

def download_youtube_audio(youtube_id, path):
	url = f'https://www.youtube.com/watch?v={youtube_id}'
	final_ext = "wav"
	ydl_opts = {
		'format': 'm4a/bestaudio/best',
		"outtmpl": os.path.join(path, "%(id)s.%(ext)s"),
		"final_ext": final_ext,
		# ℹ️ See help(yt_dlp.postprocessor) for a list of available Postprocessors and their arguments
		'postprocessors': [{  # Extract audio using ffmpeg
			'key': 'FFmpegExtractAudio',
			'preferredcodec': final_ext,
		}],
		"noprogress": True,
		"quiet": True
	}

	try:
		with yt_dlp.YoutubeDL(ydl_opts) as ydl:
			info = ydl.extract_info(url, download=True)
			original_filename = ydl.prepare_filename(info)
			# split extension from pathname
			file_pathname = os.path.splitext(original_filename)[0]
			postprocessed_filename = file_pathname + f".{final_ext}"
			return postprocessed_filename
	except UnavailableVideoError as e:
		raise YoutubeVideoNotAvailable()
	except DownloadError as e:
		print(e)
		raise YoutubeDownloadError()		