import { ObjectId } from 'mongodb'

export type UserDocument = {
  _id: ObjectId,
  name: string,
  lastName: string,
  email: string,
  password: string,
}
