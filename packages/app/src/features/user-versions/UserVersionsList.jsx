import Key from '@chords-extractor/common/key'

import { List } from '@/shared/components/List'
import { SongCard } from '@/shared/components/SongCard'
import { paths } from '@/shared/config/paths'
import { getYoutubeHqDefaultThumbnailById } from '@/shared/utils/getYoutubeThumbnailById'
import { joinWithBulletPoint } from '@/shared/utils/joinWithBulletPoint'

export function UserVersionsList ({ versions }) {
  return (
    <List
      results={versions}
      itemKeyFn={(version) => version.id}
      renderItem={version =>
        <UserSongVersionItem
          version={version}
        />}
    />
  )
}

function UserSongVersionItem ({ version }) {
  const keyLabel = `Key ${Key.getPreferredKeyLabelFromKey(version.key)}`
  const artistNameText = version.song.youtubeChannel.name
  const bpmText = `${Math.round(version.bpm)} bpm`
  return (
    <SongCard>
      <SongCard.Thumbnail>
        <SongCard.ThumbnailImg src={getYoutubeHqDefaultThumbnailById(version.song.youtubeId)} />
      </SongCard.Thumbnail>
      <SongCard.Content>
        <SongCard.Title
          tooltipTitle={version.song.title}
          navigable
          to={paths.chords.build({ params: { songId: version.song.id }, search: { version: version.id } })}
        >
          {version.song.title}
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
        </SongCard.Body>
      </SongCard.Content>
    </SongCard>
  )
}
