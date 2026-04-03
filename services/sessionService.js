import pool from "../config/pg.js";

export default class SessionService {
  static async createSession({ userId, token }, db = pool) {
    const query = `
      INSERT INTO sessions (user_id, token)
      VALUES ($1, $2)
      RETURNING id, user_id, token, created_at, expires_at
    `;
    const { rows } = await db.query(query, [userId, token]);
    return rows[0];
  }

  // NEW — used by authenticate middleware to validate the session
  static async getSession(token, db = pool) {
    const query = `
      SELECT id, user_id, token, revoked_at, created_at, expires_at
      FROM sessions
      WHERE token = $1
    `;
    const { rows } = await db.query(query, [token]);
    return rows[0] || null;
  }

  static async deleteSession(token, db = pool) {
    const query = `
      UPDATE sessions
      SET revoked_at = NOW()
      WHERE token = $1
    `;
    await db.query(query, [token]);
  }
}
