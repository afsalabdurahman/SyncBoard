import express from "express";
const router = express.Router();
import { AuthController } from "../controllers/auth/UserAuthController";
import { container } from "../../infrastructure/config/Di/TsyringConfig";
import { OTPController } from "../controllers/otp/OTPController";
import { NodemailerService } from "../../infrastructure/services/NodeMailerService";
import { AdminAuthController } from "../controllers/auth/AdminAuthController";
import { sharedController } from "../controllers/auth/SharedController";
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import {SuperadminAuthController} from "../controllers/auth/SuperadminAuthController"
const authController = container.resolve(AuthController);
const otpController = container.resolve(OTPController);
const adminController = container.resolve(AdminAuthController);
const sharedAuthController = container.resolve(sharedController);
const superController = container.resolve(SuperadminAuthController)

router.post("/user/register", (req, res, next) =>
  authController.register(req, res, next)
);
router.post("/user/sendotp", (req, res,next) => otpController.sendOTP(req, res,next));
router.post("/user/verifyotp", (req, res,next) => otpController.verifyOtp(req, res,next));
router.post("/user/login", (req, res, next) =>
  authController.login(req, res, next)
);

router.post("/admin/login", (req, res, next) =>
  adminController.LoginUsesCase(req, res, next)
);

router.post("/super/login",(req,res,next)=>{
  superController.LoginUsesCase(req,res,next)
})
router.post("/refresh-token", (req, res, next) =>
  sharedAuthController.generateNewToken(req, res, next)
);

export default router;
