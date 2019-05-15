'use strict'

const fp = require('fastify-plugin')
const typeORM = require('typeorm')

async function decorateFastifyInstance (fastify, connections, next) {
  if (connections.length === 0) {
    return next(Error('fastify-typeormdb: no connection info provided'))
  }

  try {
    await typeORM.createConnections(connections)
  } catch (e) {
    return next(e)
  }

  fastify.decorate('typeorm', typeORM)
  next()
}

function fastifyTypeORM (fastify, options, next) {
  if (fastify.typeorm) {
    return next(Error('fastify-typeormdb has already been registered'))
  }

  let connections = {}
  if (Array.isArray(options)) {
    for (let i = 0; i < options.length; i++) {
      if (!options[i].name) {
        return next(Error('fastify-typeormdb: a connection name must be provided'))
      }

      connections.push(options[i])
    }
  } else {
    connections.push(options)
  }

  decorateFastifyInstance(fastify, Object.values(connections), next)
}

module.exports = fp(fastifyTypeORM, {
  fastify: '>=2.0.0',
  name: 'fastify-typeorm'
})
