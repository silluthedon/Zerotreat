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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
