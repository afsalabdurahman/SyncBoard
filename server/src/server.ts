import express, {  Response, Request,  } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "reflect-metadata";
import { envConfig } from "./infrastructure/config/env.config";
import dotenv from "dotenv";
import { createServer,  } from "http";
import authRoutes from "./presentation/routes/authRoutes";
import workspaceRoutes from "./presentation/routes/workspaceRoutes";
import ragRoutes from "./presentation/routes/ragRoutes"
import memberRoutes from "./presentation/routes/memberRoute"
import chatRoutes from "./presentation/routes/chatRoutes";
import activityRoutes from "./presentation/routes/activityRoutes"
import projectRoutes from "./presentation/routes/projectRoutes"
import taskRoutes from "./presentation/routes/taskRoutes"
import checkoutRoutes from "./presentation/routes/checkoutRoutes"
import stripehookRoutes from "./presentation/routes/stripehookRoutes"
import { Server } from "socket.io";
import { connectToMongoDB } from "./infrastructure/config/DatabaseConfig";
import { errorMiddleware } from "./presentation/middleware/errorMiddleware";
import { initSocketServer } from "./infrastructure/services/SocketService"
import superRoutes from "./presentation/routes/superRoutes";
import ticketRoutes from "./presentation/routes/TicketRoutes"
import suscriptionRoutes from "./presentation/routes/subscriptionRoutes"




dotenv.config();




const app = express();
app.use("/api/checkout", stripehookRoutes);

const PORT = envConfig.PORT || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: envConfig.ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});



app.use(express.json());
app.use(express.raw({ type: 'application/json' }));

app.use(cookieParser());



app.use(
  cors({
    origin: envConfig.ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],

  })
);




initSocketServer(io);

const serverStart = async () => {
  connectToMongoDB();
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};
serverStart();
//
app.get("/", (reques: Request, response: Response) => {
  response.status(200).send("Health is ok")
})

app.use("/api/auth", authRoutes);
app.use("/api/member", memberRoutes)
app.use("/api/project", projectRoutes)
app.use("/api/task", taskRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/activities", activityRoutes)
app.use("/api/checkout", checkoutRoutes);
app.use("/api/subscription", suscriptionRoutes)
app.use("/api/workspace", workspaceRoutes)
app.use("/api/super", superRoutes);
app.use("/api/rag", ragRoutes)
app.use("/api/ticket", ticketRoutes)
app.use(errorMiddleware);
export { io };
