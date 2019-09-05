module.exports = {
  blocks: {
    _id: 'blocks',
    type: 'get',
    name: 'Serve blocks',
    path: '/file/block/:block',
    resolver: 'blocks'
  },
  login: {
    _id: 'login',
    type: 'post',
    name: 'Login',
    path: '/login',
    resolver: 'login'
  }
}