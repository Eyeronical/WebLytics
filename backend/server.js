require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const websiteRoutes = require('./src/routes/websiteRoutes');

const app = express();

app.use(helmet());

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://weblytics-lyart.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

const analyzeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  message: { error: 'Too many analysis requests, please wait before trying again.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/analyze', analyzeLimiter);
app.use('/api', websiteRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'WebVision API',
    version: '1.0.0',
    status: 'active',
    environment: process.env.NODE_ENV || 'development',
    endpoints: ['/api/analyze', '/api/websites', '/api/stats', '/health']
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(err.status || 500).json({ 
    error: 'Internal Server Error',
    message: isProduction ? 'Something went wrong' : err.message,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 WebVision API server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
