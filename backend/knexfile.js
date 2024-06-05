module.exports = {

  development: {
		client: 'mysql',
		connection: {
			host: '127.0.0.1',
			port: 3306,
			user: 'root',
			password: process.env.DB_PASSWORD,
			database: 'lyrnify',
		},
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

}
