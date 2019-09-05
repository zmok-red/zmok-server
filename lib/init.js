console.clear()
require('dotenv').config()
require('debug').enable('zmok:*')
const debug = require('debug')('zmok:init')
const http = require('http')

module.exports = function (config) {
  return new Promise(async (resolve, reject) => {
    try {
      debug('start')
      let now = Date.now()
      // ctx
      const ctx = {
        wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
        validate: require('./core/actions/validate'),
        crypt: require('./core/actions/crypt'),
        fieldsDefault: require('./core/fields_default'),
        fieldsRequired: require('./core/fields_required'),
        helpers: require('./core/helpers'),
        _: require('lodash')
      }
      ctx.config = await require('./load_config')(ctx, config)

      ctx.mongo = await require('./init_mongo')(ctx)

      ctx.express = await require('./init_express')(ctx)

      await require('./load_resolvers')(ctx)
      await require('./load_models')(ctx)
      await require('./load_roles')(ctx)
      await require('./load_settings')(ctx)
      await require('./load_rest')(ctx)
      await require('./load_gql')(ctx)

      // await require('./load_blocks')(ctx)
      await require('./init_client')(ctx)
      await require('./load_mail')(ctx)

      const apollo = await require('./init_apollo')(ctx)
      const server = http.createServer(ctx.express)
      apollo.applyMiddleware({app: ctx.express})
      apollo.installSubscriptionHandlers(server)

      await require('./load_state')(ctx)

      const PORT = process.env.PORT || config.server.port || 3000
      server.listen(PORT, () => {
        debug(`Server started at port: ${PORT}, ${Date.now() - now}ms`)
        // debug('done')
        resolve(ctx)
      })

    } catch (error) {
      debug('error', error)
      reject(error)
    }
  })
}
