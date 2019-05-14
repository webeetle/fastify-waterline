const plugin = require('../index')
const Fastify = require('fastify')

const fastify = Fastify()

fastify.register(plugin, { pool: 'ammt', drainTime: 0 })
fastify.ready(err => {
  console.log('mammt')
})
