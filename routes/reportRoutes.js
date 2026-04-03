import { Router } from "express";
import ReportController from "../controllers/reportController.js";
// import { authenticate } from "../middleware/authenticate.js";
// import { uploadReportImages } from "../middleware/uploadMiddleware.js";
import handleAsyncErr from "../utilities/handleAsyncErr.js";
import { uploadReportImages } from "../middlewares/uploadMiddleware.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);

// uploadReportImages runs before the controller.
// Multer populates req.files; the controller reads them.
router.post("/", uploadReportImages, handleAsyncErr(ReportController.createReport));
// router.post("/", uploadReportImages, handleAsyncErr(ReportController.createReport));
router.get("/", handleAsyncErr(ReportController.getAllReports));
router.get("/mine", handleAsyncErr(ReportController.getMyReports));
router.get("/:id", handleAsyncErr(ReportController.getReportById));
router.delete("/:id", handleAsyncErr(ReportController.deleteReport));

export default router;
