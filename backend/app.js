'use strict'

const path = require('node:path')
const AutoLoad = require('@fastify/autoload')
const cors = require("@fastify/cors");
const environment = process.env.NODE_ENV || "development";
const knexConfig = require("./knexfile")[environment];
const knex = require("knex")(knexConfig);

// Pass --options via CLI arguments in command to enable these options.
const options = {}

const whitelisted = (request) => {
  let whitelist = [
    ["PUT", "/users/login"],
//    ["OPTIONS", "/users/login"],
    ["POST", "/users/signup"],
    ["POST", "/users/reset-password"],
    ["POST", "/users/set-new-password"],
  ];
  for (let x of whitelist) {
    if (request.raw.method == x[0] && request.raw.url.match(x[1])) {
      return true;
    }
  }
  return false;
};

module.exports = async function (fastify, opts) {
  // Place here your custom code!
	fastify.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  });

	fastify.register(require("fastify-bcrypt"), {
    saltWorkFactor: 12,
  });

  fastify.register(require("@fastify/jwt"), {
    secret: "Kremlepp the farshwashh",
  });

	fastify.addHook("onRequest", async (request, reply) => {
    try {
      if (whitelisted(request)) {
        return;
      }
      await request.jwtVerify();
      let user = await knex("users")
        .where("username", request.user.username)
        .first(); // Resolves to any
      if (!user) {
        reply.code(401).send({ error: "Error, Unauthorized" });
      }
      request.user = user;
    } catch (err) {
      reply.send(err);
    }
  });



  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}

module.exports.options = options
