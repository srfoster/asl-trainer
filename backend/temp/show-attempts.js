const knex = require('../dao/knexfile');

(async function(){
	let attempts = await knex('attempts').select("*")
  console.log(attempts)
})()

