'use strict'

const fs = require('fs')
const fp = require('fastify-plugin')
const Waterline = require('waterline')
const DiskAdapter = require('sails-disk')
const MySQLAdapter = require('sails-mysql')
const MongoAdapter = require('sails-mongo')
const PostgresAdapter = require('sails-postgresql')
const { promisify } = require('util')
const path = require('path')
const readdir = promisify(fs.readdir)
const lstat = promisify(fs.lstat)
const _ = require('lodash')
const FastifyWaterline = require('./lib/fastifyWaterline')

const ADAPTERS = {
  mysql: MySQLAdapter,
  mongo: MongoAdapter,
  postgresql: PostgresAdapter,
  disk: DiskAdapter
}

async function decorateFastifyInstance (fastify, connections, next) {
  if (connections.length === 0) {
    next(Error('fastify-waterline: no connection info provided'))
    return
  }

  const adapters = {}
  const datastores = {}
  const models = {}
  for (const connection of connections) {
    if (!connection.adapter) {
      next(Error('fastify-waterline: specify a valid adapter: mysql, mongo, postgresql, disk'))
      return
    }

    if (Object.keys(ADAPTERS).indexOf(connection.adapter) === -1) {
      next(Error('fastify-waterline: adapter name not valid: mysql, mongo, postgresql, disk'))
      return
    }

    Object.assign(adapters, {
      [`sails-${connection.adapter}`]: ADAPTERS[connection.adapter]
    })

    const connectionName = connection.name || 'default'
    delete connection.name
    connection.adapter = `sails-${connection.adapter}`

    const entities = connection.entities || null
    const entitiesFolder = connection.entitiesFolder || ''
    delete connection.entities
    delete connection.entitiesFolder

    Object.assign(datastores, {
      [connectionName]: connection
    })

    if (entities) {
      const keys = Object.keys(entities)

      for (const key of keys) {
        if (!entities[key].datastore) {
          entities[key].datastore = connectionName
        }

        Object.assign(models, {
          [key]: entities[key]
        })
      }
    }

    if (entitiesFolder) {
      const folder = path.resolve(__dirname, entitiesFolder)

      try {
        await lstat(folder)
      } catch (e) {
        next(Error(`fastify-waterline: Entities folder ${entitiesFolder} does not exist.`))
        return
      }

      const files = await readdir(folder)
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        if (!file.match(/.js$/)) {
          continue
        }

        const entityName = _.camelCase(file.replace(/.js$/g, ''))
        const entity = require(path.join(folder, file))

        if (!entity.datastore) {
          entity.datastore = connectionName
        }

        Object.assign(models, {
          [entityName]: entity
        })
      }
    }
  }

  Waterline.start({
    adapters: adapters,
    datastores: datastores,
    models: models
  }, function (err, orm) {
    if (err) {
      next(Error('fastify-waterline: Could not start up the Waterline ORM\n' + err))
      return
    }

    fastify.decorate('fw', new FastifyWaterline(orm))
    fastify.addHook('onClose', (_, done) => Waterline.stop(orm, done))
    next()
  })
}

function fastifyWaterline (fastify, options, next) {
  if (fastify.waterline) {
    return next(Error('fastify-waterline has already been registered'))
  }

  const connections = []
  if (Array.isArray(options)) {
    for (let i = 0; i < options.length; i++) {
      if (!options[i].name) {
        return next(Error('fastify-waterline: a connection name must be provided'))
      }

      connections.push(options[i])
    }
  } else {
    if (Object.keys(options).length > 0) {
      connections.push(options)
    }
  }

  decorateFastifyInstance(fastify, Object.values(connections), next)
}

module.exports = fp(fastifyWaterline, {
  fastify: '>=2.0.0',
  name: 'fastify-waterline'
})
