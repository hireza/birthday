const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config({ path: "./local.env" });

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = process.env;

const client = new Client({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DATABASE,
  password: POSTGRES_PASSWORD,
  port: parseInt(POSTGRES_PORT || "5432", 10),
});

module.exports.up = async () => {
  await client.connect();
  await client.query(`
    CREATE TABLE users (
      id VARCHAR PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL, 
      full_name VARCHAR(255) NOT NULL,
      birthday VARCHAR(10) NOT NULL,
      timezone VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  await client.query(`
    CREATE INDEX idx_users_id ON users (id);
  `);

  await client.end();
};

module.exports.down = async () => {
  await client.connect();
  await client.query(`DROP TABLE users;`);
  await client.end();
};
