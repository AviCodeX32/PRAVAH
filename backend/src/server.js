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
  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  PRAVAH BACKEND RUNNING ON SUPABASE POSTGRESQL        `);
    console.log(`  Cockpit API: http://localhost:${PORT}/api            `);
    console.log(`  Health Check: http://localhost:${PORT}/health        `);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n[PRAVAH ERROR] Port ${PORT} is already in use by another running process.`);
      console.error(`To fix this:`);
      console.error(`  1. Terminate the existing process on port ${PORT}: Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force`);
      console.error(`  2. Or change PORT in backend/.env to another port (e.g. PORT=5051)\n`);
      process.exit(1);
    } else {
      console.error('[PRAVAH ERROR]', err);
    }
  });
}

startServer();
