import express from "express";
import cors from "cors";

import authRouter from "./routes/authRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import globalErrorHandler from "./middlewares/globalErrHandler.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reports", reportRouter);

app.use(globalErrorHandler);

app.use((req, res, next) => {
  res.status(404).json({ status: "fail", message: `Route ${req.originalUrl} not found` });
});
export default app;
