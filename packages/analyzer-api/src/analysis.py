from crema.analyze import analyze as crema_analyze
from jams import JAMS, Annotation, Observation
import tempfile
from yt_download import download_youtube_audio
from utils import supressed_output
import constants
from collections import Counter
from madmom.features.downbeats import RNNDownBeatProcessor, DBNDownBeatTrackingProcessor
from madmom.features.tempo import TempoEstimationProcessor 
from madmom.io.audio import Signal

TEMP_DIR_PREFIX = "jamai_yt_audio_downloads_"
TEMP_DIR_SUFFIX = "_tmp"

RNND_DOWN_BEAT_PROCESSOR = RNNDownBeatProcessor()
DBN_DOWN_BEAT_PROCESSOR = DBNDownBeatTrackingProcessor(
                                    beats_per_bar=[3, 4], 
                                    min_bpm=55.0, 
                                    max_bpm=215.0, 
                                    num_tempi=60, 
                                    transition_lambda=100, 
                                    observation_lambda=16, 
                                    threshold=0.05,
                                    correct=True,
                                    fps=100 
                                )
TEMP_ESTIMATION_PROCESSOR = TempoEstimationProcessor(fps=100)

# madmom models require 44100 sample rate and mono audio
SAMPLE_RATE = 44100
NUM_CHANNELS = 1
# crema model require float data type to work
NUMPY_DATA_TYPE = float

def load_audio(downloaded_audio_file_path): 
    madmom_signal = Signal(downloaded_audio_file_path, sample_rate=SAMPLE_RATE, num_channels=NUM_CHANNELS, dtype=NUMPY_DATA_TYPE)
    return madmom_signal

def analyze_youtube_audio(youtube_id):
    with tempfile.TemporaryDirectory(prefix=TEMP_DIR_PREFIX, suffix=TEMP_DIR_SUFFIX) as temp_directory:
        downloaded_audio_file_path = download_youtube_audio(youtube_id, temp_directory)

        madmom_signal = load_audio(downloaded_audio_file_path)

        beats, bpm, beats_per_bar = get_beats_info(madmom_signal)

        chords = get_chords(madmom_signal, madmom_signal.sample_rate)

        duration_pitch_class_profile = chords_to_pitch_class_profile_by_duration(chords)
        key_estimator = KeyEstimator()
        estimated_key = key_estimator(duration_pitch_class_profile)

        beat_chords = sync_chords_to_beats(chords, beats)

        return {
            'key': estimated_key,
            'bpm': bpm, 
            'beat_chords': beat_chords, 
            'beats_per_bar': beats_per_bar
        }

# BEATS RECOGNITION

# using madmom models it gets beats and the beat number within the bar, the stronger bpm value and most common beats per bar measure
def get_beats_info(madmom_signal):

    beats, down_beats_activations = get_beats(madmom_signal)

    # gets only beats probability columns from activations to determinate stronger beat
    beats_activations = down_beats_activations[:, 0] 
    
    bpm = get_bpm(beats_activations)

    beats_per_bar = get_most_common_beats_per_bar_measure_from_beats(beats)

    return beats, bpm, beats_per_bar

def get_beats(madmom_signal):
    # probabilities of each frame being a beat and a downbeat eg: [[beat_prob, down_beat_prob], ...]
    down_beats_activations = RNND_DOWN_BEAT_PROCESSOR(madmom_signal)

    # gets beats from activations
    beats = DBN_DOWN_BEAT_PROCESSOR(down_beats_activations)
    # truncate beat number
    beats = [(time, int(number)) for (time, number) in beats]
    return beats, down_beats_activations

def get_bpm(beats_activations):
    posible_bpms_and_strengths = list(TEMP_ESTIMATION_PROCESSOR(beats_activations))
    posible_bpms_and_strengths.sort(reverse=True, key=lambda tempo: tempo[1])
    stronger_bpm = posible_bpms_and_strengths[0][0]
    return round(stronger_bpm, 3)

def get_most_common_beats_per_bar_measure_from_beats(beats):
    # get beats_per_bar
    FIRST_BEAT_PER_BAR_NUMBER = 1
    beats_per_bar = []
    very_last_beat_index = len(beats) - 1
    for index, (_, beat_number_in_bar) in enumerate(beats):
        is_very_last_beat = index == very_last_beat_index
        is_last_beat_of_bar = (
            beats[index+1][1] == FIRST_BEAT_PER_BAR_NUMBER 
            if not is_very_last_beat 
            else False
            )

        if(is_very_last_beat or is_last_beat_of_bar):
            beats_per_bar.append(beat_number_in_bar)

    most_common_beats_per_bar_measure = None
    if(len(beats_per_bar) == 0):
        print("unknown beats per bar, using 4 as a default")
        most_common_beats_per_bar_measure = 4
    else:
        most_common_beats_per_bar_measure = Counter(beats_per_bar).most_common(1)[0][0]
    return most_common_beats_per_bar_measure

# CHORDS RECOGNITION

JAMS_ANOTATION_NAMESPACE = 'chord'
# using crema model it recognizes chords from audio  
def get_chords(audio_data, sample_rate):
  # supress outputs on production
  with supressed_output(enabled=not constants.IS_DEBUG):
    jams_result: JAMS = crema_analyze(y=audio_data, sr=sample_rate)
    chords_observations: list[Observation] = next(
        (
            annotation.data 
            for annotation in jams_result.annotations 
            if isinstance(annotation, Annotation) and annotation.namespace == JAMS_ANOTATION_NAMESPACE
        ),
    [])
    return chords_observations

# CHORDS AND BEATS SYNCING

import copy


# Syncing is done by matching each chord to the closest beat to handle timing differences between the models.
def sync_chords_to_beats(chords, beats):
    sync_beats_and_chords = [{ 'time': round(beat[0], 3), 'number': round(beat[1]), 'chord': None } for beat in beats]
    for chord in chords:
        # find the closest beat
        nearest_index = min(
            range(len(beats)), 
            key=lambda i: abs(beats[i][0] - chord.time)
        )
        sync_beats_and_chords[nearest_index]['chord'] = chord.value

    return sync_beats_and_chords



# KEY ESTIMATION

# -------------------------------------

import numpy as np
import chordparser

def chord_to_pitch_classes(chord_parser: chordparser.Parser, chord_label: str):

    if(chord_label == "N" or chord_label == "X"): return []

    cleaned_up_chord_label = chord_label.replace(":", "")
    
    parsed_chord = None
    
    try:
        parsed_chord = chord_parser.create_chord(cleaned_up_chord_label)
    except:
        return []

    pitch_classes = [note.num_value() for note in parsed_chord.notes]

    return pitch_classes

def chords_to_pitch_class_profile_by_duration(chords):

    pitch_class_profile = np.zeros(12)
    chord_parser = chordparser.Parser()
    for chord_observation in chords:
        for pitch_class in chord_to_pitch_classes(chord_parser, chord_observation.value):
            pitch_class_profile[pitch_class] += chord_observation.duration

    return pitch_class_profile

import scipy.linalg 
import scipy.stats
from dataclasses import dataclass

# Krumhansl-Schmuckler key estimation alg implementation based from:
# https://gist.github.com/bmcfee/1f66825cef2eb34c839b42dddbad49fd?permalink_comment_id=4413242#gistcomment-4413242
# For more about how does the alg work see: http://rnhart.net/articles/key-finding/

@dataclass
class KeyEstimator:

    MODES = {
        'major': 'major',
        'minor': 'minor',
    }

    major = np.asarray(
        [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]
    )
    minor = np.asarray(
        [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]
    )

    def __post_init__(self):
        self.major = scipy.stats.zscore(self.major)
        self.major_norm = scipy.linalg.norm(self.major)
        self.major = scipy.linalg.circulant(self.major)

        self.minor = scipy.stats.zscore(self.minor)
        self.minor_norm = scipy.linalg.norm(self.minor)
        self.minor = scipy.linalg.circulant(self.minor)

    def __call__(self, x: np.array) -> str:

        x = scipy.stats.zscore(x)
        x_norm = scipy.linalg.norm(x)

        coeffs_major = self.major.T.dot(x) / self.major_norm / x_norm
        coeffs_minor = self.minor.T.dot(x) / self.minor_norm / x_norm

        estimated_major_key_number, estimated_major_key_coeff = max(enumerate(coeffs_major), key=lambda key: key[1])
        estimated_minor_key_number, estimated_minor_key_coeff = max(enumerate(coeffs_minor), key=lambda key: key[1])

        if(estimated_major_key_coeff >= estimated_minor_key_coeff): 
            return  { 'pitch_class': estimated_major_key_number, 'mode': self.MODES['major'] } 
        
        return { 'pitch_class': estimated_minor_key_number, 'mode': self.MODES['minor'] } 