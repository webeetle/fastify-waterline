# fastify-waterline

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/) ![Build Status](https://travis-ci.com/webeetle/fastify-waterline.svg?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/webeetle/fastify-waterline.svg)](https://greenkeeper.io/) ![npm-version](https://img.shields.io/npm/v/fastify-waterline.svg)

`fastify-waterline` add a [Waterline](https://waterlinejs.org/) ORM instance to your [Fastify](https://github.com/fastify/fastify) project.

## What is Waterline?

Waterline is a datastore-agnostic tool that dramatically simplifies interaction with one or more databases. It provides an abstraction layer on top of the underlying database, allowing you to easily query and manipulate your data without writing vendor-specific integration code.

## Install

```
npm i fastify-waterline --save
```

## Usage

First of all you need to define a model. A model represents a set of structured data, called records. Models usually correspond to a table/collection in a database, attributes correspond to columns/fields, and records correspond to rows/documents. Here is an example:

```
// file models/user.js
'use strict'

module.exports = {
  attributes: {
    id: {
      type: 'number',
      autoMigrations: { autoIncrement: true }
    },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    username: {
      type: 'string',
      required: true
    }
  },
  primaryKey: 'id',
  tableName: 'users'
}
```

Now let's imagine that this model represent a table in a MySQL database called `test`. Now we can add the `fastify-waterline` plugin at our fastify instance in this way:

```
const fastify = Fastify()
fastify.register(require('fastify-waterline'), [{
  name: 'mysql',
  adapter: 'mysql',
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'test',
  entitiesFolder: './models'
}])

fastify.ready(async err => {
  if (err) {
    fastify.log.error(err)
  }

  const UserModel = await fastify.fw.getModel('user')
  let newUser = await UserModel.create({
    firstName: 'Davide',
    lastName: 'D\'Antonio',
    username: 'ddantonio'
  }).meta({ fetch: true })
})
```

The Fastify instance expose two methods `getModel` and `getInstance`

## Options

|  Option | Description |
| ------------- | ------------- |
| `name` | The name of the connection |
| `adapter` | The adapter that must be used. One of `mysql`, `mongo`, `postgresql`, `disk`|
| `host` | The database host |
| `port` | The database port |
| `user` | The database user |
| `password` | The database password |
| `entitiesFolder` | The folder path of our `.js` entities files |
| `entities` | An array of entities for example `[ require('./models/user'), require('./models/post') ]` |

Other available options can be found on [here](https://github.com/balderdashy/waterline)

## Contributing

If you feel you can help in any way, be it with examples, extra testing, or new features please open a pull request or open an issue.

The code follows the Standard code style.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Acknowledgements

This project is kindly sponsored by [Webeetle](http://webeetle.com)

## License

Licensed under [MIT](./LICENSE).
