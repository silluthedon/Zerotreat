// একদম উপরে require-এর বদলে নিচের লাইনটি লিখুন
import 'dotenv/config';

// module.exports-এর বদলে export default ব্যবহার করুন
export default {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations'
    }
  }
};