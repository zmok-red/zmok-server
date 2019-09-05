const { gql } = require('apollo-server-express')
// const coreFields = require('./core_fields')

module.exports = function
  ({
    QUERIES,
    MUTATIONS,
    SUBSCRIPTIONS,
    TYPES,
    FIELDS_DEFAULT,
    CUSTOM
  })
  {
    return gql`
      # Scalars
      scalar JSON

      # Fragments

      # Directives
      directive @auth(
        type: String
        role: String
      ) on FIELD_DEFINITION

      # Query
      type Query
        {
          getApp: JSON @auth
          getUser: JSON @auth
          getUserRole: JSON @auth
          getUserPages: JSON @auth
          getUserChannels: JSON @auth
          getUserSettings: JSON @auth
          getModel(model: String!): JSON @auth
          getModels: JSON @auth
          find(model: String!, filter: JSON, sort: JSON, page: JSON): findResult! @auth
          collections: JSON! @auth
          ${QUERIES}
        }

      # Mutation
      type Mutation
        {
          # LOGINS
          login(input: loginInput!): loginResult! @auth
          # CRUD
          create(model: String!, doc: JSON!): JSON! @auth
          update(model: String!, input: updateInput!): Boolean! @auth
          delete(model: String!, input: deleteInput!): Boolean! @auth
          trash(model: String!, input: trashInput!): Boolean! @auth
          userCreate: Boolean! @auth
          ${MUTATIONS}
        }

      # Subscription
      type Subscription
        {
          crud: crudResult
          ${SUBSCRIPTIONS}
        }

      # Other
      type loginResult { token: String!, expires: String! }
      input loginInput { username: String! password: String! }
      input createInput { doc: JSON options: JSON }
      input updateInput { filter: JSON set: JSON  options: JSON }
      input deleteInput { filter: JSON options: JSON }
      input trashInput { filter: JSON options: JSON }
      input findInput { filter: JSON sort: JSON page: JSON options: JSON }
      type findResult {
        items: [Item]
        next: String
        size: Int
        total: Int
        filters: JSON
      }
      type crudResult {
        action: String!
        model: String!
        doc: JSON
      }

      # Interfaces
      interface Item {
        ${FIELDS_DEFAULT}
      }
      ${TYPES}
      ${CUSTOM}
      # Some what?
      # extend type Query {
      #   findMessage: findMessageResult
      # }
      # type findMessageResult {
      #   items: [Message]
      #   total: Int
      # }
      # extend type Subscription {
      #   createdMessage: Message
      #   updatedMessage: Message
      #   deletedMessage: Message
      # }
    `
  }
