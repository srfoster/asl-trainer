const knex = require('../dao/knexfile');

(async function(){
	await knex('attempts').del()
})()

