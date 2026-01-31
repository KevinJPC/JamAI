import Key from '@chords-extractor/common/key'

import { List } from '@/shared/components/List'
import { SongCard } from '@/shared/components/SongCard'
import { paths } from '@/shared/config/paths'
import { getYoutubeHqDefaultThumbnailById } from '@/shared/utils/getYoutubeThumbnailById'
import { joinWithBulletPoint } from '@/shared/utils/joinWithBulletPoint'

export function UserFavoriteSongsList ({ favoritesSongs }) {
  return (
    <List
      results={favoritesSongs}
      renderItem={(favoriteSong) => <UserFavoriteSongItem song={favoriteSong} />}
      itemKeyFn={(favoriteSong) => favoriteSong.id}
    />
  )
}

function UserFavoriteSongItem ({ song }) {
  const keyLabel = `Key ${Key.getPreferredKeyLabelFromKey(song.defaultVersion.key)}`
  const artistNameText = song.youtubeChannel.name
  const bpmText = `${Math.round(song.defaultVersion.bpm)} bpm`
  return (
    <SongCard>
      <SongCard.Thumbnail>
        <SongCard.ThumbnailImg src={getYoutubeHqDefaultThumbnailById(song.youtubeId)} />
      </SongCard.Thumbnail>
      <SongCard.Content>
        <SongCard.Title
          tooltipTitle={song.title}
          navigable
          to={paths.chords.build({ params: { songId: song.id }, search: { version: song.defaultVersion.id } })}
        >
          {song.title}
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
