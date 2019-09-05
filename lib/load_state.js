const debug = require('debug')('zmok:load_state')
const {create} = require('./core/resolvers/mutation')

module.exports = function (ctx) {
  return new Promise(async (resolve, reject) => {
    try {
      // debug('start')

      const collectionsDbFull = await ctx.mongo.collections()
      const collectionsDb = collectionsDbFull.map(c => c.s.namespace.collection)
      // debug('collectionsDb', collectionsDb)
      
      let state = ctx.config.state || {}
      for (let c in state) {
        // clone then drop collection
        if (collectionsDb.includes(c)) {
          await ctx.mongo.collection(c).aggregate([{ $out:  `${c}-${Date.now()}`}]).toArray()
          await ctx.mongo.dropCollection(c)
        }
        // create items
        for (let i = 0; i < state[c].length; i++) {
          // debug('state[c][i]._id', state[c][i]._id)
          await create(null, {model: c, doc: state[c][i]}, ctx)
        }
      }

      resolve()
      debug('done')
    } catch (error) {
      debug('error', error)
      reject(error)
    }
  })
}
