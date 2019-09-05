const {ObjectID} = require('mongodb')

module.exports = {
  addDefaults (fields, doc, user, model) {
    const defaults = {
      '_id': () => ObjectID().toString(),
      '_now': () => Date.now(),
      '_user': () => user,
      '_model': () => model
    }

    for (let f in fields) {
      if (fields[f]['default'] !== undefined && !doc[f]) {
        if (defaults[fields[f]['default']]) doc[f] = defaults[fields[f]['default']].call(this)
        else doc[f] = fields[f]['default']
      }
    }

    return doc
  }
}
