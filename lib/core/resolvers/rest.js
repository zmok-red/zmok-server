const debug = require('debug')('zmok:rest')
const path = require('path')

module.exports = {
  blocks: async (req, res, ctx) => {
    try {
      debug('@block start', req.params.block)
      let block = req.params.block
      let block_arr = block.split('.')
      debug('block_arr', block_arr)
      const blockPath = path.resolve(process.cwd(), 'blocks-dist', block, block + '.umd.min.js')
      debug('blockPath', blockPath)
      // if (!fs.existsSync(blockPath)) throw {status: 404, message: 'No such block!'}
      // check existance
      res.sendFile(path.resolve(process.cwd(), 'blocks-dist', block, block + '.umd.min.js'))
      // if (block_arr[block_arr.length - 1] === 'map') {
      //   res.sendFile(path.resolve(process.cwd(), 'blocks-dist', block_arr[0], block))
      // } else {
      //   res.sendFile(path.resolve(process.cwd(), 'blocks-dist', block, block + '.umd.min.js'))
      // }
      // res.json({all: req.params.block})
      debug('@block done')
    } catch (error) {
      res.status(error.status || 404)
      res.end()
    }
  },
  login: async (req, res, ctx) => {
    try {
      debug('@login start')
      let username = req.body.username
      let password = req.body.password
      let token = ''
      if (username === 'admin') {
        if (password === process.env.PASSWORD) {
          token = process.env.PASSWORD
        } else {
          throw {status: 403, message: `Wrong credentials!`}
        }
      } else {
        // find user by username
        let user = await ctx.mongo.collection('User').findOne({username})
        if (!user) throw {status: 403, message: `No such user!`}
        if (!user.role) throw {status: 403, message: `No user role!`}

        // compare passwords
        let passwordCorrect = await ctx.crypt.compare(password, user.password)
        if (!passwordCorrect) throw {status: 403, message: `Wrong password!`}

        // sign new token
        token = await ctx.crypt.sign({_id: user._id, role: user.role, now: Date.now()})
      }
      debug('@login done')
      res.status(200)
      res.json({
        token: token,
        exp: Date.now() + 1000 * 60 * 60
      })
    } catch (e) {
      debug('@login error', e)
      res.status(e.status || 500)
      res.send(e.message || e.toString())
    }
  }
}
