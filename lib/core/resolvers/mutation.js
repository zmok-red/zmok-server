const {ObjectID} = require('mongodb')
const debug = require('debug')('zmok:mutation')
const pubsub = require('../pubsub')

module.exports = {
  login (__, {input}, ctx, info) {
    return new Promise(async (resolve, reject) => {
      try {
        debug('@login start')
        let token = null

        // get user
        let user = await ctx.mongo.collection('User').findOne({username: input.username})
        if (user === null) throw new ApolloError(`No such user! ${input.username}`, 400, {})
        if (!user.role) throw new ApolloError(`No role for user! ${input.username}`, 400, {})
        if (!ctx.roles[user.role]) throw new ApolloError(`No such role! ${user.role}`, 400, {})

        // check password
        let passwordValid = await ctx.crypt.compare(input.password, user.password)
        if (passwordValid === false) throw new ApolloError(`Wrong password!`, 400)

        token = await ctx.crypt.sign({_id: user._id, role: user.role, now: Date.now().toString()})
        debug('@login done')
        resolve({token: token, expires: (Date.now() + 1000 * 60 * 60).toString()})
      } catch (error) {
        debug('@login error', error)
        reject(error)
      }
    })
  },
  userCreate (__, {input}, ctx, info) {
    return new Promise((resolve, reject) => {
      try {
        debug('@userCreate start')
        debug('@userCreate done')
        resolve()
      } catch (error) {
        debug('@userCreate error', error)
        reject(error)
      }
    })
  },
  // messageTrash (__, {input}, ctx, info) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       debug('@messageTrash start')
  //       if (!input.channel) throw new ApolloError(`No channel`, 400)
  //       debug('@messageTrash done')
  //     } catch (error) {
  //       debug('@messageTrash error', error)
  //       reject(error)
  //     }
  //   })
  // },
  // messageCreate (__, {input}, ctx, info) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       debug('@messageCreate start')
  //       // ctx.db.collection('Message').insertOne({})
  //       debug('@messageCreate done')
  //     } catch (error) {
  //       debug('@messageCreate error', error)
  //     }
  //   })
  // },
  create (__, p, ctx, info) {
    return new Promise(async (resolve, reject) => {
      try {
        // debug('@create start', Object.keys(ctx))
        let model = p.model
        let modelObj = ctx.models[model]
        if (!modelObj) throw new Error(`No model found! ${model}`, 400, {})
        // debug('@create', modelObj)
        let doc = p.doc
        // set defaults
        const defaults = {
          '_id': () => ObjectID().toString(),
          '_now': () => Date.now(),
          '_user': () => ctx.user || 'admin',
          '_model': () => model
        }
        // set model and _id
        // doc.model = model
        // if (!doc._id) doc._id = ObjectID().toString()
        // debug('@create doc before defaults', doc)
        // set defauls from fields
        let fields = modelObj.schema.properties
        for (let f in fields) {
          if (fields[f]['default'] !== undefined && !doc[f]) {
            if (defaults[fields[f]['default']]) doc[f] = defaults[fields[f]['default']].call(this)
            else doc[f] = fields[f]['default']
          }
        }
        // debug('@create doc before validate', doc)
        // validate with schema
        await ctx.validate(modelObj.schema, doc)

        // check unique
        for (let f in fields) {
          if (fields[f]['unique'] !== undefined && doc[f]) {
            let findOne = await ctx.mongo.collection(model).findOne({[f]: doc[f]})
            // debug('@create unique findOne', findOne, f, doc[f])s
            if (findOne !== null) throw new Error(`Duplicate! with ${f}: ${doc[f]} in model: ${model}!`, 400)
          }
        }

        // hooks
        const hooks = modelObj.hooks

        // preCreate
        if (hooks && hooks.preCreate && hooks.preCreate.length > 0) {
          for (let i = 0; i < hooks.preCreate.length; i++) {
            await ctx.resolvers.Hook[hooks.preCreate[i]](__, {model, doc: doc, fields, hooks}, ctx, info)
          }
        }

        // create operation
        // debug('create doc', doc)
        let item = null
        try {
          item = await ctx.mongo.collection(model).insertOne(doc)
        } catch (error) {
          debug('@create createOp error', error)
          debug('@create error.code', error.code)
          if (error.code === 11000) throw new Error(`Duplicate of _id! ${doc._id}`)
          else throw error
        }
        

        // postCreate
        if (hooks && hooks.postCreate && hooks.postCreate.length > 0) {
          for (let i = 0; i < hooks.postCreate.length; i++) {
            await ctx.resolvers.Hook[hooks.postCreate[i]](__, {model, doc, fields, hooks}, ctx, info)
          }
        }

        // send event
        pubsub.publish('crud', { crud: {model: model, action: 'create', doc: {...item.ops[0], __typename: model}} })

        debug('@create done')
        resolve(item.ops[0])
      } catch (error) {
        debug('@create error', error)
        reject(error)
      }
    })
  },
  update (__, {input}, ctx, info) {
    return new Promise((resolve, reject) => {
      try {
        debug('@update start')
        debug('@update done')
        resolve()
      } catch (error) {
        debug('@update error', error)
        reject(error)
      }
    })
  },
  delete (__, {input}, ctx, info) {
    return new Promise((resolve, reject) => {
      try {
        debug('@delete start')
        debug('@delete done')
        resolve()
      } catch (error) {
        debug('@delete error', error)
        reject(error)
      }
    })
  }
}
