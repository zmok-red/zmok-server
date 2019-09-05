const debug = require('debug')('zmok:init_mongo')
const MongoClient = require('mongodb').MongoClient

module.exports = function (ctx) {
  return new Promise(async (resolve, reject) => {
    try {
      // debug('start')
      const config = ctx.config.mongo
      const cluster = await MongoClient.connect(config.uri, { useNewUrlParser: true, useUnifiedTopology: true })
      const client = config.db ? cluster.db(config.db) : cluster.db()
      
      // TODO: handle mongo connection errors...
      debug('done')
      resolve(client)
    } catch (error) {
      debug('error', error)
      reject(error)
    }
  })
}
