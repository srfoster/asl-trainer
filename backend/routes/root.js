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


let items = require("./temp.js")  
let i = 0

let cors = require('@fastify/cors')

module.exports = async function (fastify, opts) {
  await fastify.register(cors, { 
		// put your options here
	})

  fastify.get('/', async function (request, reply) {
    return { root: true }
  })

  fastify.get('/feed-next', async function (request, reply) {
    let num = request.query.number
    let user_id = 1
    let rating_range = "easy"
    //For this user, select the feed items within their rating range,
    //  that they haven't done recently

    //Shit rating being separated by type is not what we want is it??

/.where("rating > ? && rating < ?")

    let items_in_range      = await knex("feed_items").select("*") 
    let items_recently_done = await knex("feed_items") 
  

    return ret
  })
}
