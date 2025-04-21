import express from 'express';
import cors from 'cors';
import dbConnect from './utils/dbConnect.js';
import mongoRoutes from './routes/authRoutes.js';
import mysqlRoutes from './routes/authRoutesMySQL.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/mongo', mongoRoutes);
app.use('/api/mysql', mysqlRoutes);

app.get('/', (req, res) => res.send('✅ Server Running'));

dbConnect().then(() => {
  app.listen(5000, () => console.log('🚀 Server listening at http://localhost:5000'));
});
