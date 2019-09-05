const debug = require('debug')('zmok:app_directives')
const { SchemaDirectiveVisitor, ApolloError } = require('apollo-server-express')
const { defaultFieldResolver } = require('graphql')

class auth extends SchemaDirectiveVisitor {

  visitFieldDefinition(field, { objectType }) {
    // debug('auth vf', Object.keys(field))
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function (...args) {

      const [__, p, ctx, info] = args

      debug('@auth: ', field.name)
      debug('@auth token: ', typeof ctx.token)
      if (ctx.token !== 'null' && ctx.token !== null && ctx.token !== undefined) {
        // debug("@auth GOT TOKEN", ctx.token, typeof ctx.token)
        if (ctx.token === process.env.PASSWORD) {
          ctx.role = ctx.roles['admin']
          ctx.user = 'admin'
        } else {
          let userFromToken = await ctx.crypt.verify(ctx.token)
          // debug('userFromToken', userFromToken)
          if (userFromToken === false) throw new ApolloError('Wrong token!', 401, {})
          if (!ctx.roles[userFromToken.role]) throw new ApolloError(`No such role!`, 401, {})
          ctx.role = ctx.roles[userFromToken.role]
          ctx.user = userFromToken._id
        }
      } else {
        // debug('@auth ANONIMUS')
        ctx.role = ctx.roles['anon']
        ctx.user = 'anon'
      }

      // check action in role
      debug('@auth user', ctx.user)
      debug('@auth role', ctx.role._id)
      if (!ctx.role.role.actionsAll) {
        if (!ctx.role.role.actions.includes(field.name)) throw new ApolloError(`401 No such action! ${field.name}`, 401, {})
      }

      // debug('@auth done', field.name)
      return resolve.apply(this, args)
    }
  }
}

module.exports = { auth }