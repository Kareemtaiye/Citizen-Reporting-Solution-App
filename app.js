import express from "express";
import cors from "cors";

import authRouter from "./routes/authRoutes.js";
import globalErrorHandler from "./middlewares/globalErrHandler.js";

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use((req, res, next) => {
  res.status(404).json({ status: "fail", message: `Route ${req.originalUrl} not found` });
});

app.use(globalErrorHandler);
export default app;
