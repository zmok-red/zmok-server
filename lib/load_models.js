const debug = require('debug')('zmok:load_models')

module.exports = function (ctx) {
  return new Promise(async (resolve, reject) => {
    try {
      // debug('start')
      // add typeDefault for every model
      let model = require('./core/model')
      let modelsCore = require('./core/models')
      let modelsUser = ctx.config.models || {}

      let fieldsRequied = require('./core/fields_required')
      let fieldsDefault = require('./core/fields_default')

      // merge models
      for (let m in modelsUser) {
        if (modelsCore[m]) {
          modelsCore[m] = ctx._.mergeWith(
            modelsUser[m],
            modelsCore[m],
            (to, from) => {
              if (ctx._.isArray(to)) return ctx._.union(to, from)
            }
          )
        } else {
          modelsCore[m] = modelsUser[m]
        }
      }

      for (let m in modelsCore) {

        // set default properties & required
        modelsCore[m].schema.properties = {...modelsCore[m].schema.properties, ...fieldsDefault}
        modelsCore[m].schema.required = ctx._.union(modelsCore[m].schema.required, fieldsRequied)

        // add defaults
        ctx.helpers.addDefaults(modelsCore[m].schema.properties, modelsCore[m], 'admin', m)

        // check hook existance
        if (modelsCore[m].hooks) {
          for (let h in modelsCore[m].hooks) {
            modelsCore[m].hooks[h].map(hook => {
              if (!ctx.resolvers.Hook[hook]) throw new Error(`No ${h} hook: ${hook} for model: ${m}!`)
            })
          }
        }

        // validate
        try {
          await ctx.validate(model.schema, modelsCore[m])
        } catch (error) {
          debug('error', error)
          throw {status: 400, message: `Wrong model ${m}!`}
        }
      }

      // debug('models', models)

      ctx.models = modelsCore
      debug('done')
      resolve()
    } catch (error) {
      debug('error', error)
      reject(error)
    }
  })
}
