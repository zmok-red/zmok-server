const debug = require('debug')('zmol:init_express')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')

module.exports = function (ctx) {
  return new Promise((resolve, reject) => {
    try {
      debug('start')
      const app = express()

      app.use(cors())
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extended: false }))

      debug('done')
      resolve(app)
    } catch (error) {
      debug('error', error)
      reject(error)
    }
  })
}
