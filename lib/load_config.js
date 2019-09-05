const debug = require('debug')('zmok:load_config')

module.exports = function (ctx, config) {
  return new Promise(async (resolve, reject) => {
    try {
      // debug('start')

      // check config
      if (!config) throw {status: 500, message: 'No config!'}

      const {Config} = require('./core/models')

      // validate config
      await ctx.validate(Config.schema, config)
      ctx.app = config.app
      debug('done')
      resolve(config)
    } catch (error) {
      debug('error', error)
      reject(error)
    }
  })
}
