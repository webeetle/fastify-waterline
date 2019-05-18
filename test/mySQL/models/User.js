'use strict'

module.exports = {
  attributes: {
    id: {
      type: 'number',
      autoMigrations: { autoIncrement: true }
    },
    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    username: { type: 'string', required: true }
  },
  primaryKey: 'id',
  tableName: 'users',
  schema: true
}
