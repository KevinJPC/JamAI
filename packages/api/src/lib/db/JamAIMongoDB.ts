import { Db, MongoClient, TransactionOptions, WithTransactionCallback } from 'mongodb'
import { UserDocument } from './documents/UserDocument.js'
import { SongDocument } from './documents/SongDocument.js'
import { VersionDocument } from './documents/VersionDocument.js'
import { FavoriteSongDocument } from './documents/FavoriteSongDocument.js'
import { SessionCollection } from '../sessionStore.js'

// mongo client automatically handles connection pool and calls `connect`when performing operations
// thats why the client should be reuse across the application, to avoid creating connection pools every time.
// see more: https://www.mongodb.com/docs/drivers/node/current/connect/mongoclient/

class JamAIMongoDB {
  public client: MongoClient
  public db: Db
  private dbName: string

  constructor ({ uri, dbName }: { uri: string, dbName: string }) {
    this.dbName = dbName
    this.client = new MongoClient(uri)
    this.db = this.client.db(this.dbName)
  }

  public async ensureConnection () {
    try {
      await this.client.connect()
      console.log('JamAI MongoDB connection successful')
    } catch (error) {
      if (error instanceof Error) throw new Error(`Error connecting to JamAI MongoDB. ${error.message}`)
      throw error
    }
  }

  users () {
    return this.db.collection<UserDocument>('users')
  }

  songs () {
    return this.db.collection<SongDocument>('songs')
  }

  versions () {
    return this.db.collection<VersionDocument>('versions')
  }

  favoriteSongs () {
    return this.db.collection<FavoriteSongDocument>('favorite-songs')
  }

  sessions (): Awaited<SessionCollection> {
    return this.db.collection('sessions')
  }

  async withTransaction<T> (cb: WithTransactionCallback<T>, opts?: TransactionOptions) {
    const session = this.client.startSession()
    try {
      return await session.withTransaction(async () => {
        return cb(session)
      }, opts)
    } finally {
      await session.endSession()
    }
  }
}

let _jamAIMongoDB: JamAIMongoDB | null = null

export function jamAIMongoDB () {
  if (!_jamAIMongoDB) throw new Error('JamAIMongoDB instance has not been initialized')
  return _jamAIMongoDB
}

export async function setupJamAIMongoDB (opts: { uri: string, dbName: string }) {
  _jamAIMongoDB = new JamAIMongoDB(opts)
  await _jamAIMongoDB.ensureConnection()
}
