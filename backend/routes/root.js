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
    let rating_ease = "easy"
    let rating_offsets = {easy:   [-200, 0], 
                          medium: [-100, 100], 
                          hard:   [0, 200]}[rating_ease]

    //For this user, select the feed items within their rating range,
    //  that they haven't done recently

    let user         = await knex("users").select("*").where({user_id})
    let rating_range = rating_offsets.map(o => user.rating - o)

    let items_recently_done = 
      await knex("attempts")
        .select("feed_item_id")
        .where({user_id})
        .orderBy("timestamp", "desc")
        .limit(10)  

    let items_in_range      = 
      await knex("feed_items")
        .select("*")
        .whereBetween("rating", rating_range)
        .where("feed_item_id", "not in", items_recently_done.map(o => o.feed_item_id))
        .limit(num)

    return items_in_range
  })
}
