const { gql } = require('apollo-server-express')

const zmok = {
  init: require('./lib/init'),
  Debug: require('debug'),
  gql
}
// TODO: how to freeze better?

module.exports = Object.freeze(zmok)
