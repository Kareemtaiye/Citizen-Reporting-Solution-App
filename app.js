import express from "express";
import cors from "cors";

import authRouter from "./routes/authRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import globalErrorHandler from "./middlewares/globalErrHandler.js";

const app = express();

// Handle preflight for ALL routes first
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reports", reportRouter);

app.use(globalErrorHandler);

app.use((req, res, next) => {
  res.status(404).json({ status: "fail", message: `Route ${req.originalUrl} not found` });
});
export default app;
