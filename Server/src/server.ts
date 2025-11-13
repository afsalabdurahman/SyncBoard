import express, { NextFunction, Response, Request } from "express";
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
import activityRoutes from "./presentation/routes/activityRoutes"
import projectRoutes from "./presentation/routes/projectRoutes"
import taskRoutes from "./presentation/routes/taskRoutes"
import checkoutRoutes from "./presentation/routes/checkoutRoutes"
import { Server } from "socket.io";
import { connectToMongoDB } from "./infrastructure/config/DatabaseConfig";
import { CustomRequest } from "./presentation/types/CustomRequest";
import { errorMiddleware } from "./presentation/middleware/errorMiddleware";
import { initSocketServer } from "./infrastructure/services/SocketService"
import bodyParser from "body-parser"
import Stripe from "stripe";
import superRoutes from "./presentation/routes/superRoutes"
import suscriptionRoutes from "./presentation/routes/subscriptionRoutes"
import { SuscriptionRepository } from "./infrastructure/repositories/SuscriptionRepository";
import { generatePDFReceipt } from "./infrastructure/services/GeneratePdf";
import { NodemailerService } from "./infrastructure/services/NodeMailerService";

const STRIPE_WEBHOOK_SECRET = envConfig.STRIPE_WEBHOOK_SECRET || ""
const sentMail = container.resolve(NodemailerService)
dotenv.config();

const strip = new Stripe(envConfig.STRIP_KEY, {
  apiVersion: "2025-08-27.basil"
})
const suscriptionRepo = container.resolve(SuscriptionRepository)

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
    if (!sig) {
      res.status(400).send("Missing Stripe signature");
      return;
    }

    let event: Stripe.Event;

    try {
      event = strip.webhooks.constructEvent(
        req.body,
        sig,
        STRIPE_WEBHOOK_SECRET
      );

    } catch (err: any) {
      console.error("❌ Webhook signature verification failed:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }



    switch (event.type) {
      // case "invoice.payment_succeeded":
      //   const recipt = event.data.object as Stripe.Invoice
      //   const pdf=recipt.invoice_pdf;
      //   const email=recipt.customer_email
      //   if(email)await sentMail.sentRecipt(email,pdf)

      // break;
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("🎉 Checkout completed:5550", session);

        if (session.metadata) {
          console.log(session.metadata)
          await suscriptionRepo.updateSuscriptionPlan(session.metadata.userId, session.metadata.planName, "active")
        }
        if (session.invoice) {
          const invoice = await strip.invoices.retrieve(session.invoice as string);
          const pdf = invoice.invoice_pdf;
          const email = invoice.customer_email;

          if (email && pdf) {
            console.log("📧 Sending receipt email after checkout:", email);
            await sentMail.sentRecipt(email, pdf);
          }
        }



        break;
      case "invoice.payment_failed":
        const invoice = event.data.object as Stripe.Invoice;
        console.log("❌ Payment failed:00000", invoice);
        break;
      default:
        console.log(`Unhandled event type00000 ${event.type}`);
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
app.use("/api/member", memberRoutes)
app.use("/api/project", projectRoutes)
app.use("/api/task", taskRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/activities", activityRoutes)
app.use("/api/checkout", checkoutRoutes);
app.use("/api/subscription", suscriptionRoutes)
app.use("/api/workspace", workspaceRoutes)
// app.use("/admin", adminRouter);
app.use("/api/super", superRoutes);
app.use(errorMiddleware);
export { io };
