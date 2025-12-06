import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

dotenv.config();

import healthRoutes from './routes/health.js';
import ocrRoutes from './routes/ocr.js';
import warrantyRoutes from './routes/warranty.js';
import authRoutes from './routes/auth.js';

const app = express();

// Trust Proxy (Required for Render/Vercel behind load balancer)
app.set('trust proxy', 1);

// Security Headers
app.use(helmet());
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Compression
app.use(compression());

const corsOptions = {
  origin: process.env.FRONTEND_URL, // Strict origin
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' })); // Reduced limit

app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/warranty', warrantyRoutes);

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => res.send('Warranty Backend running'));

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
