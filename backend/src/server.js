import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifySupabaseConnection } from './config/supabase.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'PRAVAH Industrial Regulatory Orchestration Engine',
    database: 'Supabase PostgreSQL Cloud',
    supabaseUrl: process.env.SUPABASE_URL || 'https://bkidxhsahwggipciiwpm.supabase.co',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

async function startServer() {
  await verifySupabaseConnection();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  PRAVAH BACKEND RUNNING ON SUPABASE POSTGRESQL        `);
    console.log(`  Cockpit API: http://localhost:${PORT}/api            `);
    console.log(`  Health Check: http://localhost:${PORT}/health        `);
    console.log(`=======================================================`);
  });
}

startServer();
