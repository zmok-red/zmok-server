
module.exports = {
  _id: {type: 'string', input: '_id', label: '_id', readonly: true, default: '_id'},
  type: {type: 'string', input: 'type', label: 'type', default: ''},
  model: {type: 'string', input: 'model', label: 'model', readonly: true, default: '_model'},
  name: {type: 'string', input: 'text', label: 'name', default: ''},
  description: {type: 'string', input: 'textarea', label: 'description', default: ''},
  createdAt: {type: 'integer', input: 'datetime', label: 'createdAt', default: '_now', readonly: true},
  createdBy: {type: 'string', input: 'ref', from: 'User', label: 'createdBy', default: '_user', readonly: true},
  updatedAt: {type: 'integer', input: 'datetime', label: 'updatedAt', default: '_now', readonly: true},
  updatedBy: {type: 'string', input: 'ref', from: 'User', label: 'updatedBy', default: '_user', readonly: true},
  trashed: {type: 'boolean', input: 'boolean', label: 'trashed', default: false, readonly: true}
}
