const debug = require('debug')('zmok:load_settings')

module.exports = function (ctx) {
  return new Promise(async (resolve, reject) => {
    try {
      // debug('start')
      const settingsCore = require('./core/settings')
      const settingsUser = []

      ctx.settings = settingsCore
      debug('done')
      resolve()
    } catch (error) {
      debug('error', error)
      reject(error)
    }
  })
}
