'use strict'

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'lyrnify',
  },
});

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })

  fastify.get('/feed-next', async function (request, reply) {
    let items = await knex("feed_items").select("*")
    return items
  })
}
