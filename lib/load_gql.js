const debug = require('debug')('zmok:load_gql')

module.exports = function (ctx) {
  return new Promise((resolve, reject) => {
    try {
      // debug('start')
      let typesMap = {
        'string': 'String!',
        'boolean': 'Boolean!',
        'number': 'Int!',
        'array': 'JSON',
        'object': 'JSON'
      }
      let gqlUser = ctx.config.gql || ``
      let injection = {
        INTERFACES: ``,
        SCALARS: ``,
        FRAGMENTS: ``,
        QUERIES: `findMessage: JSON`,
        MUTATIONS: `kill: JSON`,
        SUBSCRIPTIONS: `mill: JSON`,
        TYPES: `
        `,
        FIELDS_DEFAULT: `
          _id: String!
          type: String
          name: String
        `,
        CUSTOM: ``
      }

      // inject all implementations...
      // required fields
      // auth shit?
      // custom directives?

      let models = ctx.models
      for (const m in models) {
        // debug('model', m)
        let model = models[m]
        let fieldsGql = ``
        let modelGql = (fields) => `
          type ${m} implements Item {
            ${fields}
          }
        `
        for (const p in model.schema.properties) {
          let prop = model.schema.properties[p]
          fieldsGql += `${p}: ${typesMap[prop.type] || 'String!'}
          `
        }
        // debug('fieldsGql', fieldsGql)
        // debug('modelGql', modelGql)
        injection.TYPES += modelGql(fieldsGql)
      }
      let gqlCore = require('./core/gql')(injection)
      // TODO: required fields
      // need to inject user gql to core gql
      // need to generate new types? new mutations? new subscriptions? new queries?
      // or user find, update, delete, live

      ctx.gql = gqlCore
      debug('done')
      resolve()
    } catch (error) {
      debug('error', error)
      reject(error)
    }
  })
}
