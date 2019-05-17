'use strict'

const fp = require('fastify-plugin')
const Waterline = require('waterline')

async function decorateFastifyInstance (fastify, connections, next) {
  if (connections.length === 0) {
    return next(Error('fastify-waterline: no connection info provided'))
  }
  next()
}

function fastifyWaterline (fastify, options, next) {
  if (fastify.waterline) {
    return next(Error('fastify-waterline has already been registered'))
  }

  if (!options) {
    return next(Error('fastify-waterline: no connection info provided'))
  }

  let connections = []
  if (Array.isArray(options)) {
    for (let i = 0; i < options.length; i++) {
      if (!options[i].name) {
        return next(Error('fastify-waterline: a connection name must be provided'))
      }

      connections.push(options[i])
    }
  } else {
    connections.push(options)
  }
  console.log(connections)
  process.exit(1)

  decorateFastifyInstance(fastify, Object.values(connections), next)
}

module.exports = fp(fastifyWaterline, {
  fastify: '>=2.0.0',
  name: 'fastify-waterline'
})
