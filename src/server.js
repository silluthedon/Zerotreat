import express from 'express';
import cors from 'cors';
import knex from './database/connection.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root check
app.get('/', async (req, res) => {
  try {
    await knex.raw('SELECT version()');
    res.send('✅ Database Connected & Server Running!');
  } catch (error) {
    res.status(500).send('❌ Database Error: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});