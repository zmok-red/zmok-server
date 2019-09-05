const debug = require('debug')('zmok:load_roles')

module.exports = function (ctx) {
  return new Promise(async (resolve, reject) => {
    try {
      // debug('start')

      let rolesCore = require('./core/roles')
      let rolesUser = ctx.config.roles || {}


      // merge roles
      for (let r in rolesUser) {
        if (rolesCore[r]) {
          rolesCore[r] = ctx._.mergeWith(
            rolesUser[r],
            rolesCore[r],
            (to, from) => {
              if (ctx._.isArray(to)) return ctx._.union(to, from)
            }
          )
        } else {
          rolesCore[r] = rolesUser[r]
        }
      }

      for (let r in rolesCore) {

        ctx.helpers.addDefaults(ctx.models.Role.schema.properties, rolesCore[r], 'admin', 'Role')
        // TODO: add hooks for roles
        // validate
        try {
          await ctx.validate(ctx.models.Role.schema, rolesCore[r])
        } catch (error) {
          debug('error', error)
          throw {status: 400, message: `Wrong role ${r}!`}
        }
      }

      ctx.roles = rolesCore
      debug('done')
      resolve()
    } catch (error) {
      debug('error', error)
      reject(error)
    }
  })
}
