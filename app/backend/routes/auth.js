const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const ACCESS_TTL_MIN = Number(process.env.ACCESS_TTL_MIN || 15);
const RESET_TTL_MIN  = Number(process.env.RESET_TTL_MIN  || 60);
const JWT_SECRET     = process.env.JWT_SECRET || 'dev-secret-change-me';

function signAccess(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id || null },
    JWT_SECRET,
    { algorithm: 'HS256', expiresIn: `${ACCESS_TTL_MIN}m` }
  );
}

module.exports = function registerAuth(app) {
  const db = app.db;

  // REGISTER
  app.post('/v1/auth/register', async (req, reply) => {
    const { email, password, name } = req.body || {};
    if (!email || !password) return reply.code(400).send({ error: 'email and password required' });
    const hash = await bcrypt.hash(password, 12);

    const sql = `
      INSERT INTO users (id, tenant_id, email, password_hash, name, role, status)
      VALUES ($1, NULL, $2, $3, $4, 'member', 'active')
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, role, tenant_id
    `;
    const id = uuidv4();
    const res = await db.query(sql, [id, email.toLowerCase().trim(), hash, name || null]);
    if (res.rowCount === 0) return reply.code(409).send({ error: 'email already registered' });
    return { ok: true };
  });

  // LOGIN
  app.post('/v1/auth/login', async (req, reply) => {
    const { email, password } = req.body || {};
    if (!email || !password) return reply.code(400).send({ error: 'email and password required' });

    const q = await db.query('SELECT id, email, password_hash, role, tenant_id FROM users WHERE email=$1', [email.toLowerCase().trim()]);
    if (q.rowCount === 0) return reply.code(401).send({ error: 'invalid credentials' });
    const user = q.rows[0];

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return reply.code(401).send({ error: 'invalid credentials' });

    const token = signAccess(user);
    await db.query('UPDATE users SET last_login_at=now() WHERE id=$1', [user.id]);
    return { access_token: token, user: { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id } };
  });

  // FORGOT (always 200)
  app.post('/v1/auth/forgot-password', async (req, reply) => {
    const { email } = req.body || {};
    const e = (email || '').toLowerCase().trim();
    const q = await db.query('SELECT id FROM users WHERE email=$1', [e]);

    if (q.rowCount > 0) {
      const userId = q.rows[0].id;
      const token = uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '');
      const expires = new Date(Date.now() + RESET_TTL_MIN * 60 * 1000);
      await db.query(
        `INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1,$2,$3)
         ON CONFLICT (token) DO NOTHING`,
        [userId, token, expires]
      );
      // MVP: log the reset URL (replace with email later)
      app.log.warn(`Password reset link: ${(process.env.APP_BASE_URL || 'http://localhost:3000')}/reset?token=${token}`);
    }
    return { ok: true };
  });

  // RESET
  app.post('/v1/auth/reset-password', async (req, reply) => {
    const { token, new_password } = req.body || {};
    if (!token || !new_password) return reply.code(400).send({ error: 'token and new_password required' });

    const q = await db.query(
      `SELECT pr.id, pr.user_id, pr.expires_at, pr.used_at
       FROM password_resets pr
       WHERE pr.token=$1`,
      [token]
    );
    if (q.rowCount === 0) return reply.code(400).send({ error: 'invalid token' });

    const row = q.rows[0];
    if (row.used_at) return reply.code(400).send({ error: 'token already used' });
    if (new Date(row.expires_at).getTime() < Date.now()) return reply.code(400).send({ error: 'token expired' });

    const hash = await bcrypt.hash(new_password, 12);
    await db.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, row.user_id]);
    await db.query('UPDATE password_resets SET used_at=now() WHERE id=$1', [row.id]);

    return { ok: true };
  });
};
