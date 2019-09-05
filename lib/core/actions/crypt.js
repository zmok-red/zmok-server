const debug = require('debug')('zmok:action_crypt')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const password =  require('generate-password')

module.exports = {
  hash (data) {
    return bcrypt.hash(data, 8)
  },
  compare (data, hash) {
    return bcrypt.compare(data, hash)
  },
  sign (data) {
    return new Promise((resolve, reject) => {
      jwt.sign(data, process.env.PASSWORD, {expiresIn: '1h'}, (err, token) => {
        if (err) reject(err)
        else resolve(token)
      })
    })
  },
  verify (data) {
    return new Promise((resolve, reject) => {
      jwt.verify(data, process.env.PASSWORD, (err, decoded) => {
        if (err) resolve(false)
        else resolve(decoded)
      })
    })
  },
  generate (length) {
    return password.generate({length: length || 8, numbers: true})
  }
}
