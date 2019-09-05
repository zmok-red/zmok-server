const debug = require('debug')('zmok:hook')

module.exports = {
  async User_preCreate_password (__, p, ctx, info) {
    // debug('@User_preCreate_password start')
    if (p.doc.password) {
      p.doc.password = await ctx.crypt.hash(p.doc.password)
    }
  }
}
