import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import healthRoutes from './routes/health.js';
import ocrRoutes from './routes/ocr.js';
import warrantyRoutes from './routes/warranty.js';

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Allow specific origin or all
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

app.use('/health', healthRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/warranty', warrantyRoutes);

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => res.send('Warranty Backend running'));

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
