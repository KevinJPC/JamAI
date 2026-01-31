import { skipToken, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'

import {
  deleteUserSongVersion,
  favoriteSong,
  getSongById,
  getSongVersionById,
  getSongVersions,
  saveUserSongVersion,
  unfavoriteSong
} from '@/features/song/services/songs'
import { rateVersion } from '@/features/song/services/versions'
import { queryClient } from '@/shared/lib/queryClient'
import { songKeys as songSharedKeys } from '@/shared/queries/songQueries'
import { userKeys } from '@/shared/queries/userQueries'

const songKeys = {
  ...songSharedKeys,
  songVersionsList: ({ songId }) => [...songKeys.all, songId, 'versions', 'list'],
  songVersionDetail: ({ songId, versionId }) => [...songKeys.all, songId, 'versions', 'detail', versionId]
}

export const useSong = ({ id }) => {
  return useQuery({
    queryKey: songKeys.detail(id),
    queryFn: () => getSongById({ id }),
    staleTime: Infinity,
  })
}

export const useSongVersion = ({ songId, versionId }) => {
  const { status, data, isPlaceholderData, error, refetch, isError, isPending, isSuccess } = useQuery({
    queryKey: songKeys.songVersionDetail({ songId, versionId }),
    queryFn: songId && versionId ? () => getSongVersionById({ songId, versionId }) : skipToken,
    staleTime: Infinity,
  })

  return { data, status, error, isPlaceholderData, refetch, isError, isPending, isSuccess }
}

export function useSongVersions ({ songId, enabled }) {
  const songVersionsQuery = useInfiniteQuery({
    queryKey: songKeys.songVersionsList({ songId }),
    queryFn: ({ pageParam }) => getSongVersions({ songId, continuationToken: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextContinuationToken,
    select: (data) => {
      return data.pages.flatMap(p => p.items)
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  })

  return songVersionsQuery
}

export function useRateVersion () {
  return useMutation({
    mutationFn: ({ versionId, rating, songId }) => rateVersion({ versionId, rating }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        songKeys.songVersionDetail({ songId: variables.songId, versionId: variables.versionId }),
        (prevSongVersion) => {
          if (!prevSongVersion) return
          return ({
            ...prevSongVersion,
            userRating: data.userRating,
            ratingAverage: data.ratingAverage,
            ratingCount: data.ratingCount
          })
        })
    }
  })
}

export function useSaveUserSongVersion () {
  return useMutation({
    mutationFn: async ({ songId, originalVersionId, beatChords, shiftViewValue, beatsPerBar }) => {
      return saveUserSongVersion({
        songId,
        originalVersionId,
        chords: beatChords.map(beatChord => beatChord.chord),
        shiftViewValue,
        beatsPerBar
      })
    },

    onSuccess: (versionData, variables) => {
      // Update song user version cache
      queryClient.setQueryData(songKeys.detail(variables.songId), (prevSong) => {
        if (!prevSong) return
        return { ...prevSong, userVersionId: versionData.id }
      })

      // Update song version cache if any
      queryClient.setQueryData(
        songKeys.songVersionDetail({ songId: variables.songId, versionId: versionData.id }),
        (prevVersion) => {
          if (!prevVersion) return

          return {
            ...prevVersion,
            beatChords: variables.beatChords,
            shiftViewValue: variables.shiftViewValue,
            beatsPerBar: variables.beatsPerBar,
          }
        })

      return Promise.all([
        queryClient.invalidateQueries({ queryKey: songKeys.songVersionsList({ songId: variables.songId }), exact: true, }),
        queryClient.invalidateQueries({ queryKey: userKeys.userVersions(), exact: true })
      ])
    }

  })
}

export function useDeleteUserSongVersion () {
  return useMutation({
    mutationFn: async ({ songId, versionId }) => {
      return deleteUserSongVersion({
        songId,
        versionId,
      })
    },

    onSuccess: (_, { songId, versionId }) => {
      queryClient.setQueryData(songKeys.detail(songId), (prevSong) => {
        if (!prevSong) return
        return { ...prevSong, userVersionId: null }
      })

      queryClient.removeQueries({ queryKey: songKeys.songVersionDetail({ songId, versionId }), exact: true })

      return Promise.all([
        queryClient.invalidateQueries({ queryKey: songKeys.songVersionsList({ songId }), exact: true }),
        queryClient.invalidateQueries({ queryKey: userKeys.userVersions(), exact: true })
      ])
    }

  })
}

export function useToggleFavoriteSongMutation () {
  return useMutation({
    mutationFn: async ({ songId, favorited }) => {
      if (favorited) return favoriteSong({ songId })
      return unfavoriteSong({ songId })
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(songKeys.detail(variables.songId), (prevSong) => {
        if (!prevSong) return
        let newFavoritedCount
        if (prevSong.userHasFavorited === variables.favorited) {
          newFavoritedCount = prevSong.favoritesCount
        } else {
          newFavoritedCount = prevSong.favoritesCount + (variables.favorited ? 1 : -1)
        }
        return {
          ...prevSong,
          userHasFavorited: variables.favorited,
          favoritesCount: newFavoritedCount
        }
      })

      return queryClient.invalidateQueries({ queryKey: userKeys.favoriteSongs(), exact: true })
    },
  })
}
