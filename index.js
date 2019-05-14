'use strict'

const fp = require('fastify-plugin')
const typeORM = require('typeorm')

function checkConnectionName (fastify, connection) {
  return fastify.typeorm[name] ? true : false
}

function fastifyTypeORM (fastify, options, next) {
  if (fastify.typeorm) {
    return next(Error('fastify-typeormdb has already been registered'))
  }

  let connections = []
  if (Array.isArray(options)) {
    for (let i = 0; i < options.length; i++) {
      if (!options[i].name) {
        return next(Error('fastify-typeormdb a connection name must be provided'))
      }

      if (checkConnectionName(fastify, options[i].name)) {
        return next(Error(`fastify-typeormdb connection named ${options[i].name} not valid`))
      }
      connections.push(options[i])
    }
  } else {
    let name = options.name || 'defaultConn'
    if (checkConnectionName(fastify, name)) {
      return next(Error(`fastify-typeormdb connection named ${name} not valid`))
    }
    connections.push(options)
  }
}

module.exports = fp(fastifyTypeORM, {
  fastify: '>=1.1.0',
  name: 'fastify-typeorm'
})
