import express from "express";
const router = express.Router();
import { AuthController } from "../controllers/auth/UserAuthController";
import { container } from "../../infrastructure/config/Di/TsyringConfig";
import { OTPController } from "../controllers/otp/OTPController";
import { NodemailerService } from "../../infrastructure/services/NodeMailerService";

const authController = container.resolve(AuthController);
const otpController = container.resolve(OTPController);

router.post("/user/register", (req, res,next) => authController.register(req, res,next));
router.post("/user/sendotp", (req, res) => otpController.sendOTP(req, res));
router.post("/user/verifyotp", (req, res) => otpController.verifyOtp(req, res));
 router.post("/user/login",(req,res,next)=>authController.login(req,res,next))


export default router;
