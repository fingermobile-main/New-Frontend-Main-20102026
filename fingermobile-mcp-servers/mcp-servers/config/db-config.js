/* global module, process */
module.exports = {development: {,
  membername: process.env.DB_membername || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "fingermobile_dev",
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 5432,
  dialect: "postgres",
  logging: false
  },
test: {membername: process.env.DB_membername || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "fingermobile_test",
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 5432,
  dialect: "postgres",
  logging: false
  },
production: {membername: process.env.DB_membername,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: "postgres",
  logging: false,
  pool: {,
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
    }
  }
};
