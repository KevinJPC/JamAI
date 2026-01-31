import { VersionDocument } from '../lib/db/documents/VersionDocument.js'
import { InvalidVersionIdError } from '../errors.js'
import { jamAIMongoDB } from '../lib/db/JamAIMongoDB.js'
import { parseKnown } from '../utils/parseKnown.js'
import { RateVersionInput, RateVersionResponse } from '../types/versions.js'
import { rateVersionResponseSchema } from '../schemas/versions.js'

export class VersionRatingService {
  static async rateVersion (input: RateVersionInput): Promise<RateVersionResponse> {
    return await jamAIMongoDB().withTransaction(async (session) => {
      const version = await jamAIMongoDB()
        .versions()
        .findOne<Pick<VersionDocument, '_id' | 'ratings' | 'ratingAverage' | 'ratingCount'>>(
          { _id: input.versionId }, {
            projection: { ratings: 1, ratingAverage: 1, ratingCount: 1 },
            session
          })

      if (!version) throw new InvalidVersionIdError()

      const newUserRating: VersionDocument['ratings'][number] = {
        userId: input.userId,
        value: input.rating
      }

      const oldUserRatingIndex = version.ratings.findIndex(userRating => userRating.userId.equals(input.userId))
      const oldUserRatingValue = oldUserRatingIndex >= 0 ? version.ratings[oldUserRatingIndex]!.value : null

      if (oldUserRatingValue === newUserRating.value) {
        return parseKnown(rateVersionResponseSchema, {
          userRating: newUserRating.value, ratingAverage: version.ratingAverage, ratingCount: version.ratingCount
        })
      }

      const newRatingCount = oldUserRatingValue === null ? version.ratingCount + 1 : version.ratingCount
      const newRatingAverage = ((version.ratingAverage * version.ratingCount) - (oldUserRatingValue || 0) + newUserRating.value) / newRatingCount

      version.ratings[oldUserRatingValue === null ? version.ratings.length : oldUserRatingIndex] = newUserRating

      await jamAIMongoDB().versions().updateOne({ _id: input.versionId }, {
        $set: {
          ratings: version.ratings,
          ratingAverage: newRatingAverage,
          ratingCount: newRatingCount
        }
      }, { session })

      return parseKnown(rateVersionResponseSchema, {
        userRating: newUserRating.value, ratingAverage: newRatingAverage, ratingCount: newRatingCount
      })
    })
  }
}
