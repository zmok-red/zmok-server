module.exports = {
  _id: 'Model',
  model: 'Model',
  name: 'Model_model',
  schema: {
    type: 'object',
    required: ['_id', 'name', 'schema', 'hooks', 'types'],
    properties: {
      _id: {type: 'string', input: 'text', label: '_id'},
      name: {type: 'string', input: 'text', label: 'model_name'},
      description: {type: 'string', input: 'text', label: 'model_description'},
      schema: {
        type: 'object',
        required: ['required', 'properties'],
        properties: {
          required: {type: 'array'},
          properties: {type: 'object'},
          additionalProperties: {type: 'boolean'}
        }
      },
      hooks: {type: 'object', label: 'model_hooks', input: 'model_hooks'},
      types: {type: 'object', label: 'model_types', input: 'model_types'}
    },
    // additionalProperties: false
  },
  hooks: {},
  types: {}
}