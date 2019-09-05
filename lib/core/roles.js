
module.exports = {
  admin: {
    _id: 'admin',
    role: {
      modelsAll: true,
      models: {},
      actionsAll: true,
      actions: [],
      pagesAll: true,
      pages: [],
      settingsAll: true,
      settings: []
    }
  },
  anon: {
    _id: 'anon',
    role: {
      modelsAll: false,
      models: {
        User: {
          find () {
            return {forAnon: true}
          }
        }
      },
      actionsAll: false,
      actions: ['eatShit'],
      pagesAll: false,
      pages: [],
      settingsAll: false,
      settings: []
    }
  }
}
