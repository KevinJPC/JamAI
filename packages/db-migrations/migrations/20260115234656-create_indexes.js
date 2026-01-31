/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
  await Promise.all([
    db.collection('users').createIndex({ email: 1 }, { unique: true }),
    db.collection('songs').createIndex({ youtubeId: 1 }, { unique: true }),
    db.collection('versions').createIndex({ songId: 1, 'user.id': 1 }, { unique: true }),
    db.collection('favoriteSongs').createIndex({ songId: 1, userId: 1 }, { unique: true })
  ])
}

/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const down = async (db, client) => {

}
