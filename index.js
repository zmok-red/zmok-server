const { gql } = require('apollo-server-express')

const zmok = {
  init: require('./lib/init'),
  Debug: require('debug'),
  gql
}

module.exports = Object.freeze(zmok)
