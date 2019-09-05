const debug = require('debug')('zmok:init_client')
const path = require('path')
// const shell = require('shelljs')
const serveStatic = require('serve-static')
const history = require('connect-history-api-fallback')

module.exports = function (ctx) {
  return new Promise(async (resolve, reject) => {
    try {
      // debug('start')

      // client build
      // if (ctx.config.client.build) {
      //   let cmd = `cd node_modules/@zmok-red/zmok-red && npx -q quasar build -m pwa`
      //   await shell.exec(cmd, {silent: ctx.config.client.buildSilent})
      // }

      // client serve
      if (ctx.config.server.serveClient) {
        debug('serving client')
        ctx.express.use(history())
        ctx.express.use(serveStatic(path.resolve(process.cwd(), 'public')))
      }

      debug('done')
      resolve(true)
    } catch (error) {
      debug('error', error)
      reject(error)
    }
  })
}
