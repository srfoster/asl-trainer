'use strict'



const environment = process.env.NODE_ENV || "development";
const knexConfig = require("../knexfile")[environment];
const knex = require("knex")(knexConfig);
const AttemptsDAO = require("../dao/index.js").AttemptsDAO 

module.exports = async function (fastify, opts) {

  fastify.get('/', async function (request, reply) {
    return { root: true }
  })

  fastify.get('/feed-next', async function (request, reply) {

    let num = request.query.number
    let rating_ease = "easy"
    let rating_offsets = {easy:   [-200, 0], 
                          medium: [-100, 100], 
                          hard:   [0, 200]}[rating_ease]

    //For this user, select the feed items within their rating range,
    //  that they haven't done recently

    let user       = request.user 
//    let rating_range = rating_offsets.map(o => user.rating - o)

    let items_to_exclude = 
      await knex("attempts")
        .select("*")
        .where({user_id:user.id, most_recent_attempt:true})
        .orderBy("attempt_time", "desc") //Doen't matter, right?
        //.limit(10)  
				
		items_to_exclude = 
			items_to_exclude.filter((i)=>{
				return i.attempt_time.getTime()+i.cooldown_minutes*1000<new Date().getTime()
			})


    let items_in_range      = 
      await knex("feed_items")
        .select("*")
  //      .whereBetween("rating", rating_range)
        .where("id", "not in", items_to_exclude.map(o => o.feed_item_id))
        .limit(num)


		for (let i = 0; i<items_in_range.length; i++){
			let item=items_in_range[i]
			let attempt=await AttemptsDAO.create({user_id:request.user.id, feed_item_id:item.id, success:null, attempt_time:new Date()})
		}
    return items_in_range.map((item)=>{
       item.type = "MultipleChoiceFeedItem"

       item.producer = {
					username: "lalahep",
					profile_pic_url:  "/profile-pics/laura.png",
					prompt: "Alphabet Practice",
       }

       item.answer_options = item.answer_options.split("$$$$$")

       return item
    })
  })


	fastify.put("/feed-items/:id", async function (request, reply) {
		let id=request.params.id
		let answer=request.body.answer
    let item      = 
      await knex("feed_items")
        .select("*")
				.where({id})
				.first()
		let previous_attempt=
      await knex("attempts")
        .select("*")
				.where({feed_item_id:id, most_recent_attempt:true})
				.first()
		let attempt=await AttemptsDAO.create({user_id:request.user.id, 
																					feed_item_id:item.id, 
																					success: answer==item.correct_answer, 
																					attempt_time:new Date(),
																					most_recent_attempt:true,
																					cooldown_minutes:answer!=item.correct_answer?5:(previous_attempt?previous_attempt.cooldown_minutes*2:24*60)
																				})
		await knex("attempts")
			.update({most_recent_attempt:false})
			.where({id:previous_attempt.id})
		console.log(id, request.user, answer, attempt, item)
    reply.send({})
	})

	fastify.put("/users/login", async function (request, reply) {
    const { username, password } = request.body;
    let user = await knex("users").where("username", username).first();
    if (!user) {
      reply.status(401).send({ error: "Unauthorized" });
      return;
    }
    let match = await fastify.bcrypt.compare(password, user.password_hash);
    delete user.password_hash;
    if (match) {
      user.token = fastify.jwt.sign({ username });
      reply.status(200).send({ user: user, message: "Success" });
    } else {
      reply.status(401).send({ error: "Unauthorized" });
    }
  });

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
