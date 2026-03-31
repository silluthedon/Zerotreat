import express from 'express';
import cors from 'cors';
import knex from 'knex';
import knexConfig from '../knexfile.js';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const db = knex(knexConfig[process.env.NODE_ENV || 'development']);

// টেস্ট রাউট
app.get('/', async (req, res) => {
  try {
    await db.raw('SELECT 1');
    res.send('✅ Server চলছে এবং Database Connected!');
  } catch (err) {
    res.status(500).send('❌ DB Error: ' + err.message);
  }
});
// এই অংশটুকু সাময়িকভাবে এডমিন বানানোর জন্য
app.get('/setup-admin', async (req, res) => {
  try {
    const adminExists = await db('users').where({ email: 'admin@zerotreat.com' }).first();
    if (adminExists) return res.send('এডমিন ইউজার আগে থেকেই আছে!');

    await db('users').insert({
      email: 'admin@zerotreat.com',
      password_hash: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // পাসওয়ার্ড: admin123
      full_name: 'Main Admin',
      role: 'admin'
    });
    res.send('✅ এডমিন ইউজার সফলভাবে তৈরি হয়েছে! এখন লগইন করতে পারবেন।');
  } catch (err) {
    res.status(500).send('ভুল হয়েছে: ' + err.message);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
