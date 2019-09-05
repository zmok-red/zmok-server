const debug = require('debug')('zmok:init_apollo')
const { ApolloServer, withFilter } = require('apollo-server-express')

module.exports = function (ctx) {
  return new Promise(async (resolve, reject) => {
    try {
      // debug('start')
      const directives = require('./core/directives')

      const apollo = new ApolloServer({
        typeDefs: ctx.gql,
        resolvers: ctx.resolversGql,
        schemaDirectives: directives,
        subscriptions: {
          onConnect: (connectionParams, webSocket, context) => {
            // debug('subs onConnect connectionParams', connectionParams)
            const token = connectionParams.headers['Authorization']
            // debug('token', token)
            // TODO: extract user token...
            context.token = token
          },
          onDisconnect: (webSocket, context) => {
            debug('subs onDisconnect')
          }
        },
        uploads: {
          maxFileSize: 100000000, // 100mb
          maxFiles: 10
        },
        context: async ({ req, res, connection }) => {
          let token = null
          if (connection) {
            token = 'tokenFromSocket'
          } else {
            token = req.headers.authorization || null
          }
          // debug('token', token)
          return {token, req, res, ...ctx, now: Date.now()}
        }
      })
      debug('done')
      resolve(apollo)
    } catch (error) {
      debug('error', error)
      reject(error)
    }
  })
}
