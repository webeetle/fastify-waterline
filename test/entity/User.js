'use strict'

module.exports = {
  datastore: 'mysql',
  attributes: {
    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    username: { type: 'string', required: true }
  }
}
