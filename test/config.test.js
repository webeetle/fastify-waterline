'use strict'

const { test } = require('tap')
const plugin = require('../index')
const Fastify = require('fastify')

test('fastify.waterline namespace should exist', function (t) {
  const fastify = Fastify()

  fastify.register(plugin, {
    name: 'mysql',
    adapter: 'mysql',
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'test',
    entitiesFolder: './test/mySQL/models'
  })

  fastify.ready(err => {
    t.error(err)
    t.deepEqual(fastify.hasDecorator('fw'), true)
    t.ok(fastify.fw.getInstance())

    fastify.close()
    t.end()
  })
})

test('folder does not exist', function (t) {
  const fastify = Fastify()
  fastify.register(plugin, [{
    name: 'mysql',
    adapter: 'mysql',
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'test',
    entitiesFolder: './test/mySQL/models/test'
  }])

  fastify.ready(err => {
    t.ok(err.message.indexOf('fastify-waterline: Entities folder') !== -1)

    fastify.close()
    t.end()
  })
})

test('specify a valid adapter error', function (t) {
  const fastify = Fastify()
  fastify.register(plugin, [{
    name: 'mysql',
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'test',
    entitiesFolder: './test/mySQL/models'
  }])

  fastify.ready(err => {
    t.ok(err.message.indexOf('fastify-waterline: specify a valid adapter: mysql, mongo, postgresql, disk') !== -1)

    fastify.close()
    t.end()
  })
})

test('specify a valid adapter name error', function (t) {
  const fastify = Fastify()
  fastify.register(plugin, [{
    name: 'mysql',
    adapter: 'joke',
    entitiesFolder: './test/mySQL/models'
  }])

  fastify.ready(err => {
    t.ok(err.message.indexOf('fastify-waterline: adapter name not valid: mysql, mongo, postgresql, disk') !== -1)

    fastify.close()
    t.end()
  })
})

test('no connection provided', function (t) {
  const fastify = Fastify()
  fastify.register(plugin)

  fastify.ready(err => {
    t.ok(err.message.indexOf('fastify-waterline: no connection info provided') !== -1)

    fastify.close()
    t.end()
  })
})
