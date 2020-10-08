import { Router } from "express";
import AuthController from "./auth.controller";
import Passport from "../../lib/passport";

const router = Router();

router.post("/signin", AuthController.SignIn);
router.post("/signup", AuthController.SignUp);
router.post("/info", Passport.authenticate(), AuthController.Info);
router.put("/update_notification", Passport.authenticate(), AuthController.UpdateNotification);

export default router;
