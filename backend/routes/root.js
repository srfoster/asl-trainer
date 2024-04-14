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
    
//    let items = await knex("feed_items").select("*") 

    let num = request.query.number

    let ret = items.aslItems.slice(i, i + (num || 1))
    i++
    console.log("Num: "+ num, ret)
    return ret
	
    //return items
  })
}
