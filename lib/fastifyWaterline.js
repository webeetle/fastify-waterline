'use strict'

const Waterline = require('waterline')

function FastifyWaterline (orm) {
  this.orm = orm
}

FastifyWaterline.prototype.getModel = async function (model) {
  try {
    return await Waterline.getModel(model, this.orm)
  } catch (e) {
    throw new Error('fastify-waterline: ' + e)
  }
}

FastifyWaterline.prototype.getInstance = function () {
  return this.orm
}

module.exports = FastifyWaterline
