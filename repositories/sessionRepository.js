import pool from "../config/pg.js";

export default class SessionRepository {
  static async createSession({ userId, token }, db = pool) {
    const query = `
    INSERT INTO sessions (user_id, token)
    VALUES ($1, $2)
    RETURNING *
    `;

    const { rows } = await db.query(query, [userId, token]);
    return rows[0];
  }

  static async getSessionByToken(token, db = pool) {
    const query = `
    SELECT * FROM sessions
    WHERE token = $1
    `;

    const { rows } = await db.query(query, [token]);
    return rows[0];
  }

  static async deleteSession(token, db = pool) {
    const query = `
    DELETE FROM sessions
    WHERE token = $1
    `;

    await db.query(query, [token]);
  }
}
