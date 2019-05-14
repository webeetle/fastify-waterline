'use strict'

const fp = require('fastify-plugin')
const typeORM = require('typeorm')

function checkConnectionName (fastify, connection) {
  if (!fastify.typeorm)
    return false
  return fastify.typeorm[connection] ? true : false
}

async function decorateFastifyInstance (fastify, connections, next) {
  if (connections.length === 0) {
    return next(Error('fastify-typeormdb: no connection info provided'))
  }

  let connection
  try {
    connection = await typeORM.createConnections(connections)
  } catch (e) {
    return next(Error(e))
  }

  fastify.decorate('typeorm', connection)
  fastify.addHook('onClose', async (instance, done) => {
    await fastify.typeorm.close()
    done()
  })
  next()
}

function fastifyTypeORM (fastify, options, next) {
  if (fastify.typeorm) {
    return next(Error('fastify-typeormdb has already been registered'))
  }

  let connections = []
  if (Array.isArray(options)) {
    for (let i = 0; i < options.length; i++) {
      if (!options[i].name) {
        return next(Error('fastify-typeormdb: a connection name must be provided'))
      }

      if (checkConnectionName(fastify, options[i].name)) {
        return next(Error(`fastify-typeormdb: connection named ${options[i].name} not valid`))
      }
      connections.push(options[i])
    }
  } else {
    let name = options.name || 'defaultConn'
    if (checkConnectionName(fastify, name)) {
      return next(Error(`fastify-typeormdb: connection named ${name} not valid`))
    }
    connections.push(options)
  }

  decorateFastifyInstance(fastify, connections, next)
}

module.exports = fp(fastifyTypeORM, {
  fastify: '>=1.1.0',
  name: 'fastify-typeorm'
})
