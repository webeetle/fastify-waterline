const plugin = require('../index')
const Fastify = require('fastify')

const fastify = Fastify()

fastify.register(plugin, [{
  "name": "mysql",
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "fr4g0l4",
  "database": "fastbee"
}])

fastify.ready(err => {
  if (err) {
    console.log(err)
  }
  console.log('fastify is running')
})
