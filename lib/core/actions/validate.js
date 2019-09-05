const debug = require('debug')('zmok:action_validate')
const Ajv = require('ajv')
const ajv = new Ajv({$data: true, allErrors: true})

module.exports = function (schema, val) {
  return new Promise((resolve, reject) => {
    ajv.validate({$async: true, ...schema}, val)
      .then(data => {
        resolve(data)
      })
      .catch(e => {
        reject(e)
      })
  })
}
