const debug = require('debug')('zmok:query')

module.exports = {
  find (__, p, ctx, info) {
    return new Promise(async (resolve, reject) => {
      try {
        debug('@find start', p)
        let model = p.model
        const modelObj = ctx.models[model]
        if (!modelObj) throw new Error(`No such model! ${model}`)

        let filterUser = p.filter || {}
        let filters = [{trashed: false}, filterUser]

        let role = ctx.role.role
        if (!role.modelsAll) {
          if (!role.models[model] || !role.models[model]['find']) throw new Error(`Can find with model: ${model}:(`)
          filters[0] = role.models[model]['find'](ctx.user, model)
        }
        // filter
        let filter = {$and: filters}
        // let skip = 0
        // let limit = 100
        // let sort = {}
        // let project = {}
        // ops
        debug('filter', filter)
        let items = await ctx.mongo.collection(model).aggregate([
          {$match: filter}
        ]).toArray()
        // debug('@find done', Date.now() - ctx.now)
        resolve({items, filters})
        // setInterval(() => {
        //   ctx.pubsub.publish('crud', {crud: {action: 'create', doc: {}}})
        // }, 3000)
        // resolve({items: []})
      } catch (error) {
        debug('@find error', error)
        reject(error)
      }
    })
  },
  findMessage (__, p, ctx, info) {
    return new Promise(async (resolve, reject) => {
      try {
        debug('@findMessage start', p)
        let model = 'Message'

        let filterUser = p.filter || {}
        let filters = [{trashed: false}, filterUser]

        // filter
        let filter = {$and: filters}

        debug('filter', filter)

        let items = await ctx.mongo.collection(model).aggregate([
          {$match: filter}
        ]).toArray()

        resolve({items})

      } catch (error) {
        debug('@findMessage error', error)
        reject(error)
      }
    })
  },
  collections (__, {}, ctx, info) {
    return new Promise(async (resolve, reject) => {
      try {
        debug('@collections start')
        const collectionsDbFull = await ctx.mongo.collections()
        const collectionsDb = collectionsDbFull.map(c => c.s.namespace.collection)
        resolve(collectionsDb)
        debug('@collections done', Date.now() - ctx.now)
      } catch (e) {
        debug('@collections error', e)
        reject(e)
      }
    })
  },
  getApp (__, {}, ctx) {
    return new Promise(async (resolve, reject) => {
      try {
        debug('@getApp start')
        resolve(ctx.app)
        debug('@getApp done')
      } catch (error) {
        debug('@getApp error', error)
        reject(error)
      }
    })
  },
  getModel (__, {model}, ctx) {
    return new Promise(async (resolve, reject) => {
      try {
        debug('@getModel start')
        let model = ctx.models[model]
        if (!model) throw {status: 404, message: `No such model!`}
        debug('@getModel done')
        resolve(model)
      } catch (error) {
        debug('@getModel error', error)
        resolve(error)
      }
    })
  },
  getModels (__, {}, ctx) {
    return new Promise(async (resolve, reject) => {
      try {
        debug('@getModels start')
        let models = ctx.models
        resolve(models)
        debug('@getModels done')
      } catch (error) {
        debug('@getModels error', error)
      }
    })
  },
  getUser (__, {}, ctx) {
    return new Promise(async (resolve, reject) => {
      try {
        debug('@getUser start')
        let user = await ctx.mongo.collection('User').findOne({_id: ctx.user})
        if (!user) throw {status: 404, message: `No user found!`}
        // TODO: additional sanitization of user
        delete user.password
        resolve(user)
        debug('@getUser done')
      } catch (error) {
        debug('@getUser error', error)
        reject(error)
      }
    })
  },
  getUserRole (__, {}, ctx) {
    return new Promise(async (resolve, reject) => {
      try {
        debug('@getUserRole start')
        let role = ctx.role
        if (!role) throw {status: 403, message: `No user role!`}
        debug('@getUserRole done')
        resolve(role)
      } catch (error) {
        debug('@getUserRole error', error)
        reject(error)
      }
    })
  },
  getUserSettings (__, {}, ctx) {
    return new Promise(async (resolve, reject) => {
      try {
        debug('@getUserSettings start')
        let res = []
        // if (ctx.role.role.settingsAll) res = ctx.settings
        // else {
        //   ctx.role.role.settings.map(s => {
        //     // res[s] = ctx.settings.find(i => i._id === s)
        //   })
        // }
        res = ctx.settings
        debug('@getUserSettings done')
        resolve(res)
      } catch (error) {
        debug('@getUserSettings error', error)
        reject(error)
      }
    })
  }
}
