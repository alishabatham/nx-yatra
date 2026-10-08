import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import inquiryRoutes from './routes/inquiryRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB


// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', inquiryRoutes);

// Fallback 404 route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
// Connect DB first, then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `[NX Yatra Backend] Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
