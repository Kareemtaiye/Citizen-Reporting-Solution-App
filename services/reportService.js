import pool from "../config/pg.js";
import AppError from "../utilities/AppError.js";
import ReportRepository from "../repositories/reportRepository.js";

export default class ReportService {
  static async createReport({
    userId,
    title,
    description,
    category,
    latitude,
    longitude,
    imageUrls = [],
  }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const report = await ReportRepository.createReport(
        { userId, title, description, category },
        client,
      );

      if (latitude != null && longitude != null) {
        await ReportRepository.createReportGeolocation(
          { reportId: report.id, latitude, longitude },
          client,
        );
      }

      const images = [];
      for (const imageUrl of imageUrls) {
        const image = await ReportRepository.createReportImage(
          { reportId: report.id, imageUrl },
          client,
        );
        images.push(image.image_url);
      }

      await client.query("COMMIT");

      return { ...report, latitude, longitude, images };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  static async getAllReports({ category, page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    return ReportRepository.getAllReports({ category, limit, offset });
  }

  static async getReportById(id) {
    const report = await ReportRepository.getReportById(id);
    if (!report) throw new AppError(404, "Report not found");
    return report;
  }

  static async getMyReports(userId) {
    return ReportRepository.getReportsByUserId(userId);
  }

  static async deleteReport(reportId, requestingUserId, userRole) {
    const ownerId = await ReportRepository.getReportOwner(reportId);
    if (ownerId === null) throw new AppError(404, "Report not found");

    // Only the owner or an admin may delete
    if (ownerId !== requestingUserId && userRole !== "admin") {
      throw new AppError(403, "You do not have permission to delete this report");
    }

    await ReportRepository.deleteReport(reportId);
  }
}
