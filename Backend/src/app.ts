import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import settingsRoutes from './routes/settingsRoutes';
import categoryRoutes from './routes/category';
import courseRoutes from './routes/course';
import paymentRoutes from './routes/payment';
import sectionRoutes from './routes/section';
import subsectionRoutes from './routes/subsection';
import path from 'path';

const app: Express = express();
export const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'https://notewrite.sushilsahani.tech',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cookie', 
    'Origin',
    'Accept',
    'X-Requested-With',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours in seconds
}));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    query: req.query,
    params: req.params,
    body: req.method === 'POST' ? req.body : undefined
  });
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running'
  });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/sections', sectionRoutes);
app.use('/api/v1/subsections', subsectionRoutes);
// Add a test route to check token
app.get('/api/test-auth', (req, res) => {
  console.log('Cookies received:', req.cookies);
  res.json({ cookies: req.cookies });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Add security headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://notewrite.sushilsahani.tech');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Add this before your routes
app.options('*', cors()); // Enable pre-flight for all routes

export default app; 