import pool from "../config/pg.js";

export default class AuthRepository {
  static async createUser({ name, email, password }, db = pool) {
    const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING name, email, id, role
    `;

    const { rows } = await db.query(query, [name, email, password]);
    return rows[0];
  }

  static async getUserByEmail(email, db = pool) {
    const query = `
    SELECT * FROM users 
    WHERE email = $1`;

    const { rows } = await db.query(query, [email]);
    return rows[""] || null;
  }
}
