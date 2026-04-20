import express from "express";
import { AuthController } from "../controllers/auth/UserAuthController";
import { container } from "../../infrastructure/config/Di/TsyringConfig";
import { OTPController } from "../controllers/otp/OTPController";
import { AdminAuthController } from "../controllers/auth/AdminAuthController";
import { sharedController } from "../controllers/auth/SharedController";
import { SuperadminAuthController } from "../controllers/auth/SuperadminAuthController"
import { authMiddelware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";


const router = express.Router();

const authController = container.resolve(AuthController);
const otpController = container.resolve(OTPController);
const adminController = container.resolve(AdminAuthController);
const sharedAuthController = container.resolve(sharedController);
const superController = container.resolve(SuperadminAuthController);
const memberAuth = [authMiddelware(), roleMiddleware(["Admin","Member"])];
router.post("/user/register", (req, res) => authController.register(req, res));
router.post("/user/sendotp", (req, res,) => otpController.sendOTP(req, res));
router.post("/user/verifyotp", (req, res) => otpController.verifyOtp(req, res));
router.post("/user/login", (req, res, ) => authController.login(req, res, ));
router.post("/admin/login", (req, res) => adminController.LoginUsesCase(req, res));
router.post("/admin/google",(req, res) => adminController.googleAdminAuth(req, res));
router.post("/super/login", (req, res) => { superController.LoginUsesCase(req, res) })
router.post("/refresh-token", (req, res, ) => sharedAuthController.generateNewToken(req, res));
router.patch("/logout/:id", (req, res) => { authController.logout(req, res) })
router.post("/user/forgot/password", (req, res) => otpController.reSendOTP(req, res))
router.get("/user/me",memberAuth,authController.authMe.bind(authController))
router.post("/google",(req,res)=>authController.googleAuth(req,res))
export default router;

