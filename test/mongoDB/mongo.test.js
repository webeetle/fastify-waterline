'use strict'

const { test } = require('tap')
const plugin = require('../../index')
const Fastify = require('fastify')

test('mongo adapter', function (t) {
  const fastify = Fastify()
  fastify.register(plugin, [{
    name: 'mongo',
    adapter: 'mongo',
    host: 'localhost',
    port: 27017,
    user: 'root',
    database: 'test',
    entitiesFolder: './test/mongoDB/models'
  }])

  fastify.ready(async err => {
    t.error(err)

    const UserModel = await fastify.fw.getModel('user')
    const newUser = await UserModel.create({
      firstName: 'Davide',
      lastName: 'D Antonio',
      username: 'ddantonio'
    }).meta({ fetch: true })

    const id = newUser.id
    t.deepEqual(newUser, {
      id: id,
      firstName: 'Davide',
      lastName: 'D Antonio',
      username: 'ddantonio'
    })

    const updatedUsers = await UserModel.updateOne(newUser)
      .set({
        firstName: 'Paolo',
        lastName: 'Parente',
        username: 'pparente'
      })

    t.deepEqual(updatedUsers, {
      id: id,
      firstName: 'Paolo',
      lastName: 'Parente',
      username: 'pparente'
    })

    const destroyedRecord = await UserModel.destroyOne(updatedUsers)
    t.ok(destroyedRecord)
    fastify.close()
    t.end()
  })
})
