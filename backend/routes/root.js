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


let cors = require('@fastify/cors')

module.exports = async function (fastify, opts) {
  await fastify.register(cors, { 
		// put your options here
	})

  fastify.get('/', async function (request, reply) {
    return { root: true }
  })

  fastify.get('/feed-next', async function (request, reply) {
/*
    let num = request.query.number
    let user_id = 1
    let rating_ease = "easy"
    let rating_offsets = {easy:   [-200, 0], 
                          medium: [-100, 100], 
                          hard:   [0, 200]}[rating_ease]

    //For this user, select the feed items within their rating range,
    //  that they haven't done recently

    let user         = await knex("users").select("*").where({id: user_id})
    let rating_range = rating_offsets.map(o => user.rating - o)

    let items_recently_done = 
      await knex("attempts")
        .select("feed_item_id")
        .where({user_id})
        .orderBy("attempt_time", "desc") //Doen't matter, right?
        .limit(10)  

    let items_in_range      = 
      await knex("feed_items")
        .select("*")
        .whereBetween("rating", rating_range)
        .where("feed_item_id", "not in", items_recently_done.map(o => o.feed_item_id))
        .limit(num)
*/

    let items_in_range      = 
      await knex("feed_items")
        .select("*")
        .limit(3)

    console.log(items_in_range)

    return items_in_range.map((item)=>{
       item.type = "MultipleChoiceFeedItem"

       item.producer = {
					username: "lalahep",
					profile_pic_url:  "/profile-pics/laura.png",
					prompt: "Alphabet Practice",
       }

       item.answerOptions = item.answer_options.split("$$$$$")

       return item
    })
  })


fastify.post("/users/signup", async function (request, reply) {
    const { username, password, email } = request.body;
		console.log(request)
    console.log(username, password, email)
    if (!isValidEmail(email)) {
      reply.status(400).send({
        error: "Invalid Email",
      });
      return;
    }
    if (!isValidPassword(password)) {
      reply.status(400).send({
        error: "Invalid Password",
      });
      return;
    }
    const password_hash = await fastify.bcrypt.hash(password);
    const token = fastify.jwt.sign({ username });
    let createdUserID;
    try {
      [createdUserID] = await knex("users").insert({
        username: username,
        password_hash: password_hash,
        email: email,
      });
    } catch (error) {
      let errorMessage = "Problem creating user";
      if (error.sqlMessage.includes("username")) {
        errorMessage = "Username already in use";
      } else if (error.sqlMessage.includes("email")) {
        errorMessage = "Email already in use";
      }
      reply.status(400).send({
        error: errorMessage,
      });
      return;
    }
    let createdUser = await knex("users").where("id", createdUserID).first(); // Resolves to any
    reply.status(201).send({
      user: {
        username: createdUser.username,
        email: createdUser.email,
        id: createdUserID,
        token,
      },
    });
  });

	const isValidEmail = (email) => { 
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return regex.test(email);
	}

	const isValidPassword = (password) => {
		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{10,}$/;
		return regex.test(password);
	}

}
