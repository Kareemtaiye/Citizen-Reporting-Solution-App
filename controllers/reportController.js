import AppError from "../utilities/AppError.js";
import ReportService from "../services/reportService.js";

export default class ReportController {
  static async createReport(req, res, next) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError(400, "Request body is required"));
    }

    const { title, description, category, latitude, longitude, imageUrls } = req.body;

    if (!title || !description || !category) {
      return next(new AppError(400, "Title, description, and category are required"));
    }

    const validCategories = ["accident", "fighting", "rioting", "other"];
    if (!validCategories.includes(category)) {
      return next(
        new AppError(400, `Category must be one of: ${validCategories.join(", ")}`),
      );
    }

    if (latitude != null || longitude != null) {
      if (latitude == null || longitude == null) {
        return next(
          new AppError(
            400,
            "Both latitude and longitude are required when providing location",
          ),
        );
      }
      if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
        return next(new AppError(400, "Latitude and longitude must be valid numbers"));
      }
    }

    const report = await ReportService.createReport({
      userId: req.user.id,
      title,
      description,
      category,
      latitude: latitude != null ? Number(latitude) : null,
      longitude: longitude != null ? Number(longitude) : null,
      imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
    });

    res.status(201).json({ status: "success", report });
  }

  static async getAllReports(req, res, next) {
    const { category, page, limit } = req.query;

    const validCategories = ["accident", "fighting", "rioting", "other"];
    if (category && !validCategories.includes(category)) {
      return next(
        new AppError(400, `Category must be one of: ${validCategories.join(", ")}`),
      );
    }

    const reports = await ReportService.getAllReports({
      category,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });

    res.status(200).json({ status: "success", count: reports.length, reports });
  }

  static async getReportById(req, res, next) {
    const { id } = req.params;
    if (isNaN(Number(id))) return next(new AppError(400, "Invalid report ID"));

    const report = await ReportService.getReportById(Number(id));
    res.status(200).json({ status: "success", report });
  }

  static async getMyReports(req, res, next) {
    const reports = await ReportService.getMyReports(req.user.id);
    res.status(200).json({ status: "success", count: reports.length, reports });
  }

  static async deleteReport(req, res, next) {
    const { id } = req.params;
    if (isNaN(Number(id))) return next(new AppError(400, "Invalid report ID"));

    await ReportService.deleteReport(Number(id), req.user.id, req.user.role);
    res.status(200).json({ status: "success", message: "Report deleted successfully" });
  }
}
