const Fastify = require('fastify');
const { Pool } = require('pg');
const registerAuth = require('./routes/auth');

const app = Fastify({ logger: true });

// health
app.get('/v1/health', async () => ({ ok: true }));

// pg (keep non-blocking on boot)
let pool = null;
try {
  const opts = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    connectionTimeoutMillis: 1500,
    idleTimeoutMillis: 30000
  };
  if (opts.host) pool = new Pool(opts);
} catch (e) { app.log.warn(e); }

app.decorate('db', pool);

// auth routes
registerAuth(app);

// start
const port = Number(process.env.PORT || 8080);
const host = '0.0.0.0';
app.listen({ port, host })
  .then(() => app.log.info(`API on http://${host}:${port}`))
  .catch(err => { app.log.error(err); process.exit(1); });
