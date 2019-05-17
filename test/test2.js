'use strict'

const { test } = require('tap')
const plugin = require('../index')
const Fastify = require('fastify')
const User = require('./entity/User')

test('test TypeORM connection to MySQL', function (t) {
  const fastify = Fastify()

  fastify.register(plugin, [{
    name: 'mysql',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    database: 'test',
    synchronize: true,
    entitySchemas: [
      'test/entity/*.js'
  ],
  }])

  fastify.ready(async err => {
    let repository = await fastify.typeorm.getManager('mysql')

    console.log(repository)
    /*let user = new User()
    user.firstName = 'Davide'
    user.lastName = 'Davide'
    user.username = 'ddantonio'

    let insertResult = await repository.save(user)
    t.ok(insertResult)*/
  })
})
