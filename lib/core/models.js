
module.exports = {
  Config: {
    _id: 'Config',
    model: 'Model',
    name: 'Config',
    schema: {
      type: 'object',
      required: [
        'app',
        'server',
        'mongo'
      ],
      additionalProperties: false,
      properties: {
        app: {
          type: 'object',
          required: ['name'],
          input: 'json',
          properties: {
            name: {type: 'string', input: 'text'},
            description: {type: 'string', input: 'textarea'},
            colorPrimary: {type: 'string', input: 'color_primary'},
            colorSecondary: {type: 'string', input: 'color_secondary'},
            colorAccent: {type: 'string', input: 'color_accent'},
            icon: {type: 'string', input: 'icon'}
          }
        },
        server: {
          type: 'object',
          input: 'json',
          required: [],
          properties: {
            port: {type: 'number'},
            blocks: {type: 'object'},
            matrix: {type: 'string', input: 'text'}
          }
        },
        mongo: {
          type: 'object',
          input: 'json',
          required: ['uri', 'db'],
          properties: {
            uri: {type: 'string', input: 'string'},
            db: {type: 'string', input: 'string'},
            options: {type: 'object', input: 'json'}
          }
        },
        blocks: {
          type: 'object',
          input: 'json',
          required: ['serve', 'build', 'buildSilent'],
          properties: {
            serve: {type: 'boolean'},
            build: {type: 'boolean'},
            buildSilent: {type: 'boolean'}
          }
        },
        variables: {type: 'object', input: 'json'},
        resolvers: {type: 'object', input: 'json'},
        models: {type: 'object', input: 'json'},
        roles: {type: 'object', input: 'json'},
        blocks: {type: 'object', input: 'json'},
        rest: {type: 'object', input: 'json'},
        gql: {type: 'object', input: 'json'},
        state: {type: 'object', input: 'json'},
      }
    },
    hooks: {},
    types: {}
  },
  User: {
    _id: 'User',
    model: 'Model',
    name: 'User_model',
    schema: {
      type: 'object',
      required: ['username', 'password', 'role'],
      properties: {
        username: {type: 'string', input: 'text', label: 'username', readonly: true, unique: true},
        password: {type: 'string', input: 'text', label: 'password', readonly: true},
        role: {type: 'string', input: 'ref', model: 'Role', label: 'role'}
      },
      additionalProperties: false
    },
    hooks: {
      preCreate: ['User_preCreate_password']
    },
    types: {}
  },
  Role: {
    _id: 'Role',
    model: 'Model',
    name: 'Role_model',
    description: '',
    schema: {
      type: 'object',
      required: ['role'],
      properties: {
        role: {
          type: 'object',
          input: 'json',
          label: 'role',
          required: ['modelsAll', 'models', 'actionsAll', 'actions', 'pagesAll', 'pages', 'settingsAll', 'settings'],
          properties: {
            modelsAll: {type: 'boolean', input: 'boolean', label: 'role_modelsAll', default: false},
            models: {type: 'object', input: 'json', label: 'role_models', default: {}},
            actionsAll: {type: 'boolean', input: 'boolean', label: 'role_actionsAll', default: false},
            actions: {type: 'array', input: 'json', label: 'role_actions', default: []},
            pagesAll: {type: 'boolean', input: 'boolean', label: 'role_pagesAll', default: false},
            pages: {type: 'array', input: 'json', label: 'role_pages', default: []},
            settingsAll: {type: 'boolean', input: 'boolean', label: 'role_settingsAll', default: false},
            settings: {type: 'array', input: 'json', label: 'role_settings', default: []}
          }
        }
      },
      additionalProperties: false
    },
    hooks: {},
    types: {}
  },
  Page: {
    _id: 'Page',
    model: 'Model',
    name: 'Page_model',
    schema: {
      type: 'object',
      required: [],
      properties: {
        page: {
          type: 'object',
          input: 'json',
          label: 'page',
          required: [],
          properties: {
            model: {type: 'string'},
            block: {type: 'string'}
          }
        }
      },
      additionalProperties: false
    },
    hooks: {},
    types: {
      crud: {name: 'CRUD'},
      custom: {name: 'Custom'},
      remote: {name: 'Remote'}
    }
  },
  Block: {
    _id: 'Block',
    model: 'Model',
    name: 'Block_model',
    schema: {
      type: 'object',
      required: ['_id', 'type', 'name', 'block'],
      properties: {
        _id: {type: 'string'},
        type: {type: 'string'},
        name: {type: 'string'},
        block: {type: 'object'}
      },
      additionalProperties: false
    },
    hooks: {},
    types: {}
  },
  Rest: {
    _id: 'Rest',
    model: 'Model',
    name: 'Rest model',
    schema: {
      type: 'object',
      required: ['path', 'resolver'],
      properties: {
        method: {type: 'string'},
        path: {type: 'string'},
        resolver: {type: 'string'}
      },
      additionalProperties: false
    },
    hooks: {},
    types: {
      get: {name: 'GET', color: 'green'},
      post: {name: 'POST', color: 'red'}
    }
  },
  Channel: {
    _id: 'Channel',
    model: 'Model',
    name: 'Channel_model',
    schema: {
      type: 'object',
      required: ['members', 'parent'],
      properties: {
        members: {type: 'array', input: 'refs', model: 'User', label: 'Members', default: []},
        parent: {type: 'string', input: 'ref', model: 'Channel', label: 'parent', readonly: true, default: ''}
      },
      additionalProperties: false
    },
    hooks: {},
    types: {
      direct: {name: 'Direct'},
      thread: {name: 'Thread'},
      group: {name: 'Group'},
      mail: {name: 'Mail'},
      site: {name: 'Site'}
    }
  },
  Message: {
    _id: 'Message',
    model: 'Model',
    name: 'Message_model',
    schema: {
      type: 'object',
      required: ['author', 'message', 'seenBy', 'reactions'],
      properties: {
        author: {type: 'string', input: 'ref', label: 'message_author', readonly: true, default: ''},
        message: {type: 'string', input: 'message', label: 'message_message', default: ''},
        seenBy: {type: 'array', input: 'refs', model: 'User', label: 'message_seen_by', readonly: true, default: []},
        reactions: {type: 'array', input: '', label: 'message_reactions', default: []},
        channel: {type: 'string', input: 'ref', label: 'message_channel', readonly: true, default: ''}
      },
      additionalProperties: false
    },
    hooks: {},
    types: {
      mail: {name: 'Mail'},
      site: {name: 'Site'}
    }
  }
}
