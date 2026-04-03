import pool from "../config/pg.js";

export default class ReportRepository {
  static async createReport({ userId, title, description, category }, db = pool) {
    const query = `
      INSERT INTO reports (user_id, title, description, category)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, title, description, category, created_at
    `;
    const { rows } = await db.query(query, [userId, title, description, category]);
    return rows[0];
  }

  static async createReportImage({ reportId, imageUrl }, db = pool) {
    const query = `
      INSERT INTO report_images (report_id, image_url)
      VALUES ($1, $2)
      RETURNING id, report_id, image_url, created_at
    `;
    const { rows } = await db.query(query, [reportId, imageUrl]);
    return rows[0];
  }

  static async createReportGeolocation({ reportId, latitude, longitude }, db = pool) {
    const query = `
      INSERT INTO report_geolocation (report_id, latitude, longitude)
      VALUES ($1, $2, $3)
      RETURNING id, report_id, latitude, longitude, created_at
    `;
    const { rows } = await db.query(query, [reportId, latitude, longitude]);
    return rows[0];
  }

  static async getAllReports({ category, limit, offset } = {}, db = pool) {
    const params = [];
    const conditions = [];

    if (category) {
      params.push(category);
      conditions.push(`r.category = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    params.push(limit ?? 20);
    const limitClause = `LIMIT $${params.length}`;

    params.push(offset ?? 0);
    const offsetClause = `OFFSET $${params.length}`;

    const query = `
      SELECT
        r.id,
        r.title,
        r.description,
        r.category,
        r.created_at,
        u.id   AS user_id,
        u.name AS reported_by,
        g.latitude,
        g.longitude,
        COALESCE(
          json_agg(ri.image_url) FILTER (WHERE ri.image_url IS NOT NULL),
          '[]'
        ) AS images
      FROM reports r
      JOIN users u ON u.id = r.user_id
      LEFT JOIN report_geolocation g ON g.report_id = r.id
      LEFT JOIN report_images ri     ON ri.report_id = r.id
      ${where}
      GROUP BY r.id, u.id, u.name, g.latitude, g.longitude
      ORDER BY r.created_at DESC
      ${limitClause} ${offsetClause}
    `;

    const { rows } = await db.query(query, params);
    return rows;
  }

  static async getReportById(id, db = pool) {
    const query = `
      SELECT
        r.id,
        r.title,
        r.description,
        r.category,
        r.created_at,
        u.id   AS user_id,
        u.name AS reported_by,
        g.latitude,
        g.longitude,
        COALESCE(
          json_agg(ri.image_url) FILTER (WHERE ri.image_url IS NOT NULL),
          '[]'
        ) AS images
      FROM reports r
      JOIN users u ON u.id = r.user_id
      LEFT JOIN report_geolocation g ON g.report_id = r.id
      LEFT JOIN report_images ri     ON ri.report_id = r.id
      WHERE r.id = $1
      GROUP BY r.id, u.id, u.name, g.latitude, g.longitude
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  static async getReportsByUserId(userId, db = pool) {
    const query = `
      SELECT
        r.id,
        r.title,
        r.description,
        r.category,
        r.created_at,
        g.latitude,
        g.longitude,
        COALESCE(
          json_agg(ri.image_url) FILTER (WHERE ri.image_url IS NOT NULL),
          '[]'
        ) AS images
      FROM reports r
      LEFT JOIN report_geolocation g ON g.report_id = r.id
      LEFT JOIN report_images ri     ON ri.report_id = r.id
      WHERE r.user_id = $1
      GROUP BY r.id, g.latitude, g.longitude
      ORDER BY r.created_at DESC
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  }

  static async deleteReport(id, db = pool) {
    const query = `DELETE FROM reports WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  static async getReportOwner(reportId, db = pool) {
    const query = `SELECT user_id FROM reports WHERE id = $1`;
    const { rows } = await db.query(query, [reportId]);
    return rows[0]?.user_id ?? null;
  }
}
