const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
require('dotenv').config();

const db = require('./config/db');
const userService = require('./services/userService');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const tagRoutes = require('./routes/tagRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Set up CORS
app.use(cors({
  origin: true, // Allow frontend origin dynamically
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session configuration
app.use(session({
  store: new pgSession({
    pool: db.getPool(),          // 기존 PostgreSQL 커넥션 풀 재사용
    tableName: 'user_sessions',  // 세션 저장 테이블 (자동 생성)
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'memostack-default-secret-key-12345!',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // 프로덕션(HTTPS)에서만 true
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // 크로스 도메인(Vercel↔Render) 허용
  }
}));

// Base Routing
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/tags', tagRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'MemoStack API Server is healthy.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  const status = err.status || 500;
  const message = err.message || '서버 내부 오류가 발생했습니다.';
  res.status(status).json({ message });
});

// Server bootstrapper
async function startServer() {
  try {
    // 1. Initialize Oracle Pool
    await db.initializePool();
    
    // 2. Auto-seed Admin Account
    await userService.seedAdminIfEmpty();
    
    // 3. Start listener
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 MemoStack API Server running on port ${PORT}`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Handle termination signals for DB pool cleanup
const gracefulShutdown = async () => {
  console.log('\nShutting down MemoStack Server...');
  await db.closePool();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

startServer();
