const { withFilter } = require('apollo-server-express')
const debug = require('debug')('zmok:subscription')
const pubsub = require('../pubsub')

module.exports = {
  crud: {
    // subscribe: withFilter(
    //   () => pubsub.asyncIterator('crud'),
    //   (payload, variables) => {
    //     return payload
    //   }
    // )
    // subscribe (__, p, ctx) {
    //   return withFilter(
    //     () => pubsub.asyncIterator('crud'),
    //     (payload, variables) => {
    //       debug('p', p)
    //       debug('ctx', Object.keys(ctx))
    //       debug('payload', payload)
    //       debug('variables', Object.keys(variables))
    //       return true
    //     }
    //   )
    // }
    // subscribe (__, p, ctx) {
    //   debug('@crud start')
    //   return pubsub.asyncIterator(['crud'], p)
    // },
    subscribe: withFilter(
      () => pubsub.asyncIterator('crud'),
      (payload, variables) => {
        debug('payload', payload)
        debug('variables', Object.keys(variables))
       return true
      }
    )
  }
}
