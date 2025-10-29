const Redis = require('ioredis');
require('dotenv').config();

const connection = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,   // ✅ Esto es obligatorio para BullMQ
  enableOfflineQueue: false     // Opcional, recomendado
});

connection.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('[ioredis] connection error', err && err.message ? err.message : err);
});

module.exports = connection;
