import Key from '@chords-extractor/common/key'

import { List } from '@/shared/components/List'
import { SongCard } from '@/shared/components/SongCard'
import { paths } from '@/shared/config/paths'
import { getYoutubeHqDefaultThumbnailById } from '@/shared/utils/getYoutubeThumbnailById'
import { joinWithBulletPoint } from '@/shared/utils/joinWithBulletPoint'

export function LatestSongsList ({ songs, className }) {
  return (
    <List
      className={className}
      results={songs}
      itemKeyFn={(song) => song.id}
      renderItem={(song) =>
        <LatestSongItem
          id={song.id}
          title={song.title}
          youtubeId={song.youtubeId}
          youtubeChannel={song.youtubeChannel}
          defaultVersion={song.defaultVersion}
        />}
    />
  )
}

function LatestSongItem ({ id, title, youtubeId, youtubeChannel, defaultVersion }) {
  const keyLabel = `Key ${Key.getPreferredKeyLabelFromKey(defaultVersion.key)}`
  const artistNameText = youtubeChannel.name
  const bpmText = `${Math.round(defaultVersion.bpm)} bpm`
  return (
    <SongCard>
      <SongCard.Thumbnail>
        <SongCard.ThumbnailImg src={getYoutubeHqDefaultThumbnailById(youtubeId)} />
      </SongCard.Thumbnail>
      <SongCard.Content>
        <SongCard.Title
          tooltipTitle={title}
          navigable
          to={paths.chords.build({ params: { songId: id }, search: { version: defaultVersion.id } })}
        >
          {title}
        </SongCard.Title>
        <SongCard.Body>
          <SongCard.DetailsList tooltipTitle={joinWithBulletPoint([artistNameText, keyLabel, bpmText])}>
            <SongCard.DetailsItem>
              {artistNameText}
            </SongCard.DetailsItem>
            <SongCard.DetailsItem>
              {keyLabel}
            </SongCard.DetailsItem>
            <SongCard.DetailsItem>
              {bpmText}
            </SongCard.DetailsItem>
          </SongCard.DetailsList>
          <SongCard.Status isAnalyzed />
        </SongCard.Body>
      </SongCard.Content>
    </SongCard>
  )
}
