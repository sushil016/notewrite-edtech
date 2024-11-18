import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoryRoutes from './routes/category';
import sectionRoutes from './routes/section';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/sections', sectionRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

export default app; 