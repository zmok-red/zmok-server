module.exports = {
  __resolveType(item, ctx, info) {
    // debug('__resolveType', item.model)
    // TODO: fix resolving item type with model?
    return item.model || null
  }
}