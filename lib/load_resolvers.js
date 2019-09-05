const debug = require('debug')('zmok:load_resolvers')

module.exports = function (ctx) {
  return new Promise((resolve, reject) => {
    try {
      // debug('start')

      const nonGqlResolversTypes = ['Role', 'Rest', 'Hook']
      const resolversGql = {}

      // load core resolvers
      const resolversCore = require('./core/resolvers')

      // load user resovlers
      const resolversUser = ctx.config.resolvers || {}

      // merge resolvers
      for (const type in resolversUser) {
        resolversCore[type] = {...resolversUser[type], ...resolversCore[type]}
      }

      // create resolversGql
      for (const type in resolversCore) {
        if (!nonGqlResolversTypes.includes(type)) resolversGql[type] = resolversCore[type]
      }

      // debug('resolversCore', resolversCore)
      // debug('resolversGql', resolversGql)

      ctx.resolvers = resolversCore
      ctx.resolversGql = resolversGql

      debug('done')
      resolve()
    } catch (error) {
      debug('error', error)
      reject(error)
    }
  })
}
