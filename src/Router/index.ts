import { Router } from "express";
const router = Router();

import Auth from "./auth/auth.router";
import Device from "./device/device.router";
router.get("/", (req, res, next) => {
	try {
		return res.send({
			title: "Device",
			contest: "선린인터넷고등학교 IOT 경진대회",
			version: "0.0.1",
		});
	} catch (e) {
		next(e);
	}
});
router.use("/auth", Auth);
router.use("/device", Device);
export default router;
