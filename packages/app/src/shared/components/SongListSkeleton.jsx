import { CustomSkeleton } from '@/shared/components/CustomSkeleton'
import { List } from '@/shared/components/List'
import { SongCard } from '@/shared/components/SongCard'

export function SongListSkeleton ({ count = 1, brighter }) {
  return (
    <List
      results={new Array(count).fill(null)}
      itemKeyFn={(_, index) => index}
      renderItem={() =>
        <SongCardSkeleton brighter={brighter} />}
    />
  )
}

const SongCardSkeleton = ({ brighter }) =>
  <SongCard>
    <SongCard.Thumbnail>
      <CustomSkeleton fullHeightContainer fullWidthContainer height='100%' width='100%' brighter={brighter} />
    </SongCard.Thumbnail>
    <SongCard.Content>
      <CustomSkeleton width='100%' height='100%' brighter={brighter} />
      <SongCard.Body>
        <SongCard.DetailsList>
          <SongCard.DetailsItem>
            <CustomSkeleton width='250px' maxWidth='100%' brighter={brighter} />
          </SongCard.DetailsItem>
        </SongCard.DetailsList>
      </SongCard.Body>
    </SongCard.Content>
  </SongCard>
