import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifySupabaseConnection } from './config/supabase.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5050',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      // Allow all localhost origins during development
      if (/^http:\/\/localhost:[0-9]+$/.test(origin) || /^http:\/\/127\.0\.0\.1:[0-9]+$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400,
  })
);

// Explicit preflight handling
app.options('*', cors());

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

app.get('/api/health', (req, res) => {
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
  const server = app.listen(PORT, '0.0.0.0', () => {
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
