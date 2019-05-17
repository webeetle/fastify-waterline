'use strict'

const { test } = require('tap')
const plugin = require('../index')
const Fastify = require('fastify')
const User = require('./entity/User')

test('fastify.typeorm namespace should exist', function (t) {
  const fastify = Fastify()

  fastify.register(plugin, {
    'name': 'test',
    'type': 'mysql',
    'host': 'localhost',
    'port': 3306,
    'username': 'root',
    'database': 'test',
    'entities': [
      'src/entity/*.js'
    ]
  })

  fastify.ready(err => {
    t.error(err)
    t.deepEqual(fastify.hasDecorator('typeorm'), true)

    fastify.close()
    t.end()
  })
})

test('fastify.typeorm errors', function (t) {
  const fastify = Fastify()

  fastify.register(plugin, [{
    'type': 'mysql',
    'host': 'localhost',
    'port': 3306,
    'username': 'root',
    'database': 'test'
  }])

  fastify.ready(err => {
    t.ok(err.message.indexOf('fastify-typeormdb: a connection name must be provided') !== -1)

    fastify.close()
    t.end()
  })

  try {
    fastify.register(plugin)
  } catch (e) {
    t.ok(err.message.indexOf('fastify-typeormdb: no connection info provided') !== -1)
  }

  try {
    fastify.register(plugin, {})
  } catch (e) {
    t.ok(err.message.indexOf('fastify-typeormdb: no connection info provided') !== -1)
  }
})

test('test TypeORM connection to MySQL', function (t) {
  const fastify = Fastify()

  fastify.register(plugin, [{
    name: 'mysql',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    database: 'test',
    'entities': [
      'src/entity/*.js'
    ]
  }])

  fastify.ready(async err => {
    let connection = await fastify.typeorm.getManager('mysql')

    let insertResult = await connection.createQueryBuilder()
      .insert()
      .into(User)
      .values([
          {firstName: 'Davide', lastName: 'D\'Antonio', username: 'ddantonio'}
      ])
      .execute()

    t.ok(insertResult)

    const users = await connection.createQueryBuilder()
      .select('u.*')
      .from('users', "u")
      .getRawMany()

    let user = users[0]
    const id = user.id
    delete user.id

    t.deepEqual(user, {
      first_name: 'Davide',
      last_name: 'D\'Antonio',
      username: 'ddantonio'
    })

    let deleteResult = await connection.createQueryBuilder()
      .delete()
      .from('users')
      .where('id = :id', { id: id })
      .execute()

    t.ok(deleteResult)

    fastify.close()
    t.end()
  })

  try {
    fastify.register(plugin)
  } catch (e) {
    t.ok(err.message.indexOf('fastify-typeormdb: no connection info provided') !== -1)
  }

  try {
    fastify.register(plugin, {})
  } catch (e) {
    t.ok(err.message.indexOf('fastify-typeormdb: no connection info provided') !== -1)
  }
})

/*test('test TypeORM connection to MongoDB', function (t) {
  const fastify = Fastify()

  fastify.register(plugin, [{
    name: 'mongodb',
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'test',
    useNewUrlParser: true
  }])

  fastify.ready(async err => {
    let connection = await fastify.typeorm.getMongoManager('mongodb')

    let insertResult = await connection
      .insertMany('users',
      [{
        first_name: 'Davide',
        last_name: 'D\'Antonio',
        username: 'ddantonio'
      }])

    console.log(insertResult)
    t.ok(insertResult)

    fastify.close()
    t.end()
  })

  try {
    fastify.register(plugin)
  } catch (e) {
    t.ok(err.message.indexOf('fastify-typeormdb: no connection info provided') !== -1)
  }

  try {
    fastify.register(plugin, {})
  } catch (e) {
    t.ok(err.message.indexOf('fastify-typeormdb: no connection info provided') !== -1)
  }
})*/
