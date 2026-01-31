import { ObjectId } from 'mongodb'
import { jamAIMongoDB } from '../lib/db/JamAIMongoDB.js'
import { EmailAlreadyTaken, InvalidCredentialsError } from '../errors.js'
import { comparePassword, hashPassword } from '../utils/password.js'
import { UserDocument } from '../lib/db/documents/UserDocument.js'
import { SignInInput, SignUpInput } from '../types/users.js'
import { parseKnown } from '../utils/parseKnown.js'
import { userResponseSchema } from '../schemas/users.js'

export class AuthService {
  static async signIn (input: SignInInput) {
    const user = await jamAIMongoDB().users().findOne({ email: input.email })

    if (user === null) throw new InvalidCredentialsError()

    const isValidPassword = await comparePassword(input.password, user.password)
    if (!isValidPassword) throw new InvalidCredentialsError()

    return parseKnown(userResponseSchema, {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
    })
  }

  static async signUp (input: SignUpInput) {
    const userExists = !!(await jamAIMongoDB().users().countDocuments({ email: input.email }, { limit: 1 }))
    if (userExists) throw new EmailAlreadyTaken()

    const hashedPassword = await hashPassword(input.password)

    const newUser: UserDocument = {
      _id: new ObjectId(),
      name: input.name,
      lastName: input.lastName,
      email: input.email,
      password: hashedPassword
    }

    await jamAIMongoDB().users().insertOne(newUser)

    return parseKnown(userResponseSchema, {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      lastName: newUser.lastName,
    })
  }
}
