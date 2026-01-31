/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
// Fix system-versions shift value so chords align to the first downbeat
  await db.collection('versions').updateMany({
    isSystemVersion: true,
  }, [
    {
      $set: {
        shiftViewValue: {
          $mod: [
            {
              $subtract: [{
                $ifNull: [{ $first: '$beatChords.number' }, 1]
              }, 1]
            },
            '$beatsPerBar',
          ]
        }
      }
    }
  ])
}

/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const down = async (db, client) => {
}
