import config from '../config.js'
import MongoStore from 'connect-mongo'

const sessionStore = MongoStore.create({
  mongoUrl: config.mongo.uri,
  dbName: config.mongo.dbName,
  collectionName: 'sessions',
  autoRemove: 'native',
  touchAfter: config.session.expirationMs / 1000 / 2, // in seconds,
  stringify: false,
})

export default sessionStore

export type SessionCollection = Awaited<typeof sessionStore.collectionP>
