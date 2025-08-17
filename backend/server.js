require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const websiteRoutes = require('./src/routes/websiteRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

const analyzeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: { error: 'Too many analysis requests, please wait before trying again.' }
});

app.use('/api/analyze', analyzeLimiter);
app.use('/api', websiteRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Website Analyzer API',
    version: '1.0.0',
    status: 'active',
    endpoints: ['/api/analyze', '/api/websites']
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  const isDev = process.env.NODE_ENV === 'development';
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: isDev ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
