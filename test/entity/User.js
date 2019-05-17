'use strict'

const { EntitySchema } = require('typeorm')

const User = new EntitySchema({
  id: {
    primary: true,
    generated: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  username: {
    type: String
  }
})

module.export = User
