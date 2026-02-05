import { forbiddenError } from '../errors.js'
import { jamAIMongoDB } from '../lib/db/JamAIMongoDB.js'
import { userResponseSchema } from '../schemas/users.js'
import { GetAuthenticatedUserQuery, UpdateUserInput } from '../types/users.js'
import { parseKnown } from '../utils/parseKnown.js'

class UserService {
  static async getAuthenticatedUser (query: GetAuthenticatedUserQuery) {
    const user = await jamAIMongoDB().users().findOne({ _id: query.userId })
    if (!user) throw forbiddenError()

    return parseKnown(userResponseSchema, {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
    })
  }

  static async updateUser (input: UpdateUserInput) {
    await jamAIMongoDB().users().updateOne({ _id: input.userId }, {
      $set: {
        name: input.name,
        lastName: input.lastName
      }
    })
  }
}

export default UserService
