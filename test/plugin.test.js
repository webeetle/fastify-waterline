const plugin = require('../index')
const Fastify = require('fastify')

const fastify = Fastify()

fastify.register(plugin, [{
  "name": "fastbee",
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "fr4g0l4",
  "database": "fastbee"
},{
  "name": "ipm2",
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "fr4g0l4",
  "database": "ipm2"
}])

fastify.ready(async err => {
  if (err) {
    console.log(err)
  }

  let connectionFb
  try {
    connectionFb = await fastify.typeorm.getManager('fastbee')
  } catch (e) {
    process.exit(1)
  }
  const users = await connectionFb.createQueryBuilder()
    .select('u.username, u.name')
    .from('user', "u")
    .where("u.username = :username", { username: "ddantonio" })
    .getRawMany()
  console.log(users)
})
