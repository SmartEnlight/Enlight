import { Router } from "express";

const router = Router();

import DeviceController from "./device.controller";
import Passport from "../../lib/passport";

router.post("/add", Passport.authenticate(), DeviceController.Add);
router.post("/get", Passport.authenticate(), DeviceController.Get);
router.post("/update", DeviceController.Update);

export default router;
