const debug = require('debug')('zmok:load_blocks')
const shell = require('shelljs')
const path = require('path')
const fs = require('fs')

module.exports = function (ctx) {
  return new Promise(async (resolve, reject) => {
    try {
      // debug('start')
      let blocks = ctx.config.blocks 

      for (let b in blocks) {
        if (blocks[b].type === 'local') {
          // add defaults
          ctx.coreHelpers.addDefaults(ctx.models.Block.schema.properties, blocks[b], 'admin', 'Block')

          // validate block
          await ctx.validate(ctx.models.Block.schema, blocks[b])

          // load block src
          let blockSrcPath = path.resolve(process.cwd(), 'blocks-src', b)
          let blockSrcPathCheck = fs.lstatSync(blockSrcPath).isDirectory()
          if (!blockSrcPathCheck) throw new Error(`No block ${b}!`)
          // debug('blockSrcPathCheck', blockSrcPathCheck)

          // build block
          if (ctx.config.server.blocks.build) {
            debug(`building block:  ${b}`)
            let cmd = `cd node_modules/@zmok-red/zmok-red && npx -q vue-cli-service build --target lib --formats umd-min --no-clean --dest ${path.resolve(process.cwd(), 'blocks-dist', b)} --name "${b}" ${path.resolve(process.cwd(), 'blocks-src', b, 'index.vue')}`
            await shell.exec(cmd, {silent: ctx.config.server.blocks.buildSilent})
          }

        }
      }
      ctx.blocks = blocks
      debug('done')
      resolve()
    } catch (error) {
      debug('error', error)
      if (error.status === 200) {
        resolve(error)
      } else {
        reject(error)
      }
    }
  })
}
