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

fastify.ready(async err => {
  if (err) {
    console.log(err)
  }
  console.log(fastify.typeorm)

  const users = await fastify.typeorm.get('mysql')
    .createQueryBuilder()
    .select('*')
    .from('user', "u")
    .where("u.username = :username", { username: "ddantonio" })
    .getMany()

  console.log(users)
  console.log('fastify is running')
})
