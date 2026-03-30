import dotenv from 'dotenv';
dotenv.config();

const config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: './migrations',
  },
};

// দুইটা এনভায়রনমেন্টের জন্য একই কনফিগ
export default {
  development: config,
  production: config,
};