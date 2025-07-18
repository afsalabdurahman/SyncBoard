import express, { NextFunction, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "reflect-metadata";
import { envConfig } from "./infrastructure/config/env.config";
import dotenv from "dotenv";
import { createServer } from "http";
import { container } from "./infrastructure/config/Di/TsyringConfig";
import authRoutes from "./presentation/routes/authRoutes";
import workspaceRoutes from "./presentation/routes/workspaceRoutes";
import memberRoutes from "./presentation/routes/memberRoute"
import { Server } from "socket.io";
import { initSocketServer } from "./domain/interfaces/services/websocket.service.impl";
import { connectToMongoDB } from "./infrastructure/config/DatabaseConfig";
import { CustomRequest } from "./presentation/types/CustomRequest";
import { errorMiddleware } from "./presentation/middleware/errorMiddleware";

dotenv.config();
const app = express();

const CLIENT_URL = envConfig.MONGODB_URI;
const PORT = envConfig.PORT || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: envConfig.ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cookieParser());
app.use(
  cors({
    origin: envConfig.ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
app.use(express.json());

app.use(errorMiddleware);

initSocketServer(io);

let serverStart = async () => {
  connectToMongoDB();
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};
serverStart();

// app.use("/", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/member",memberRoutes)
// app.use("/admin", adminRouter);
// app.use("/super", superRouter);
