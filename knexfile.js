import dotenv from 'dotenv';
dotenv.config();

export default {
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations',
    },
  },
};