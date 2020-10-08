import { Router } from "express";
const router = Router();

import Auth from "./auth/auth.router";
import Post from "./post/post.router";
router.get("/", (req, res, next) => {
	try {
		return res.send({
			title: "Grouping",
			contest: "선린인터넷고등학교 스문 수행평가",
			version: "0.0.1",
		});
	} catch (e) {
		next(e);
	}
});
router.use("/auth", Auth);
router.use("/sleep", Post);
export default router;
