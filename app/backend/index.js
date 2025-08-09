const Fastify = require('fastify');
const { Pool } = require('pg');

const app = Fastify({ logger: true });

// health
app.get('/v1/health', async () => ({ ok: true }));

// optional DB (non-blocking at boot)
let pool = null;
try {
  if (process.env.DB_HOST) {
    pool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      // keep short timeouts so we don't block readiness
      connectionTimeoutMillis: 2000,
      idleTimeoutMillis: 30000
    });
  }
} catch (e) { app.log.warn(e); }

app.get('/v1/time', async () => ({ ts: new Date().toISOString() }));

const port = Number(process.env.PORT || 8080);
const host = '0.0.0.0';
app.listen({ port, host })
  .then(() => app.log.info(`API on http://${host}:${port}`))
  .catch(err => { app.log.error(err); process.exit(1); });
