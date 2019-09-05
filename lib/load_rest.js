const debug = require('debug')('zmok:load_rest')
const path = require('path')
const fs = require('fs')

module.exports = function (ctx) {
  return new Promise(async (resolve, reject) => {
    try {
      // debug('start')

      let restCore = require('./core/rest')
      let restUser = ctx.config.rest
      
      // check restUser
      let methods = ['post', 'get', 'put', 'patch', 'delete', 'use']

      // merge restCore and restUser
      for (let t in restUser) {
        if (restCore[t]) throw {status: 400, message: `Duplicate rest: "${t}"!`}
        restCore[t] = restUser[t]
      }

      // validate and reg restCore
      for (let t in restCore) {
        try {

          // validate
          let r = restCore[t]

          ctx.helpers.addDefaults(ctx.models.Rest.schema.properties, r, 'admin', 'Rest')

          if (r.path === '/graphql') throw {status: 400, message: `Cant set /graphql path for REST`}
          await ctx.validate(ctx.models.Rest.schema, r)

          // reg with ctx.app
          let resolver = ctx.resolvers.Rest[r.resolver]
          if (!resolver) throw {status: 400, message: `No resovler: ${r.resolver} for rest: ${t}!`}
          if (!methods.includes(r.type)) throw {status: 400, message: `Wrong method: ${r.type}, for rest: ${t}!`}

          // reg rest
          // debug('rest', r)
          ctx.express[r.type](r.path, (req, res) => resolver.call(this, req, res, ctx))

        } catch (error) {
          debug('error', error)
          throw {status: 400, message: `Wrong rest: ${t}!`}
        }
      }

      ctx.rest = restCore
      debug('done')
      resolve()
    } catch (error) {
      debug('error', error)
      reject(error)
    }
  })
}
