import express, { NextFunction, Response,Request } from "express";
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
import chatRoutes from "./presentation/routes/chatRoutes";
import activityRoutes  from"./presentation/routes/activityRoutes"
import projectRoutes from "./presentation/routes/projectRoutes"
import taskRoutes from "./presentation/routes/taskRoutes"
import checkoutRoutes from "./presentation/routes/checkoutRoutes"
import { Server } from "socket.io";
import { connectToMongoDB } from "./infrastructure/config/DatabaseConfig";
import { CustomRequest } from "./presentation/types/CustomRequest";
import { errorMiddleware } from "./presentation/middleware/errorMiddleware";
import {initSocketServer} from"./infrastructure/services/SocketService"
import bodyParser from "body-parser"
import Stripe from "stripe";
import suscriptionRoutes from "./presentation/routes/subscriptionRoutes"
import { SuscriptionRepository } from "./infrastructure/repositories/SuscriptionRepository";
const STRIPE_WEBHOOK_SECRET = envConfig.STRIPE_WEBHOOK_SECRET || ""
dotenv.config();
const strip = new Stripe(envConfig.STRIP_KEY,{
  apiVersion:"2025-08-27.basil"
})
const suscriptionRepo=container.resolve(SuscriptionRepository)
console.log(STRIPE_WEBHOOK_SECRET,"hookStripe verigyf")
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
 // For Stripe webhook


app.post(
  "/api/checkout/pay/webhook",
  bodyParser.raw({ type: "application/json" }), // Ensure raw body for Stripe
  async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"] as string;
    console.log("Raw body type:", Buffer.isBuffer(req.body) ? "Buffer" : typeof req.body);
    console.log("Raw body:", req.body);

    if (!sig) {
      res.status(400).send("Missing Stripe signature");
      return;
    }

    let event: Stripe.Event;

    try {
      event = strip.webhooks.constructEvent(
        req.body, // Must be a Buffer or string
        sig,
        STRIPE_WEBHOOK_SECRET
      );
      
      // suscriptionRepo.updateSuscriptionPlan()
      console.log("✅ Webhook received:", event.type);
      
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle events
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("🎉 Checkout completed:", session);
        
        if(session.metadata){
          console.log(session.metadata)
await suscriptionRepo.updateSuscriptionPlan(session.metadata.userId,session.metadata.planName,"active")
        }
        
        // Save subscription to DB
        break;
      case "invoice.payment_failed":
        const invoice = event.data.object as Stripe.Invoice;
        console.log("❌ Payment failed:", invoice);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.sendStatus(200); // Always acknowledge receipt to Stripe
  }
);




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

let serverStart = async () => {
  connectToMongoDB();
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};
serverStart();
//

// app.use("/", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/member",memberRoutes)
app.use("/api/project",projectRoutes)
app.use("/api/task",taskRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/activities",activityRoutes)
app.use("/api/checkout",checkoutRoutes);
app.use("/api/subscription",suscriptionRoutes)
app.use("/api/workspace",workspaceRoutes)
// app.use("/admin", adminRouter);
// app.use("/super", superRouter);
app.use(errorMiddleware);
export { io };
