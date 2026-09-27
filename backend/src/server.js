import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Enable CORS for frontend Vite dev server (usually 5173)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'PRAVAH Industrial Regulatory Orchestration Engine',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Connect to MongoDB and start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  PRAVAH DETERMINISTIC & AGENTIC BACKEND RUNNING       `);
    console.log(`  Cockpit API: http://localhost:${PORT}/api            `);
    console.log(`  Health Check: http://localhost:${PORT}/health        `);
    console.log(`=======================================================`);
  });
}

startServer();
