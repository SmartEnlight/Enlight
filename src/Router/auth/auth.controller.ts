import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

import Controller from "../../lib/controller";
import RegExp from "../../lib/regExp";
import User from "../../Model/user";

class AuthController extends Controller {
	constructor() {
		super();
	}
	/**
	 * @swagger
	 * /auth/signin:
	 *   post:
	 *     summary: 로그인을 합니다.
	 *     tags:
	 *	     - Auth
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: body
	 *         name: body
	 *         type: object
	 *         schema:
	 *           $ref: "#/definitions/RequestSignin"
	 *     responses:
	 *       200:
	 *         schema:
	 *           $ref: "#/definitions/ResponseSignin"
	 */
	public async SignIn(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password, deviceId } = req.body;

			if (super.CheckBlank(email, password, deviceId)) {
				return super.Response(res, false, 400, "빈칸을 모두 입력해 주세요.");
			}
			if (RegExp.SignIn(email, password)) {
				return super.Response(res, false, 400, "올바른 형식이 아닙니다.");
			}
			const SignInResult = await User.signIn({ email: email, password: password, deviceId: deviceId });
			if (SignInResult.success) {
				return super.Response(res, true, 200, SignInResult.message, {
					accessToken: SignInResult.token,
				});
			} else {
				return super.Response(res, false, 400, SignInResult.message);
			}
		} catch (e) {
			return next(e);
		}
	}
	/**
	 * @swagger
	 * /auth/signup:
	 *   post:
	 *     summary: 회원가입을 합니다.
	 *     tags:
	 *	     - Auth
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: body
	 *         name: body
	 *         type: object
	 *         schema:
	 *           $ref: "#/definitions/RequestSignup"
	 *     responses:
	 *       200:
	 *         schema:
	 *           $ref: "#/definitions/ResponseSignup"
	 */
	public async SignUp(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password, username, deviceId } = req.body;
			console.log(email, password, username, deviceId);
			if (super.CheckBlank(email, password, username, deviceId)) {
				return super.Response(res, false, 400, "빈칸을 모두 입력해 주세요.");
			}
			if (RegExp.SignUp(email, password, username)) {
				return super.Response(res, false, 400, "올바른 형식이 아닙니다.");
			}
			let SignUpResult = await User.create({
				email: email,
				password: password,
				username: username,
				deviceId: deviceId,
			});
			if (SignUpResult.success) {
				return super.Response(res, true, 200, SignUpResult.message);
			} else {
				return super.Response(res, false, 400, SignUpResult.message);
			}
		} catch (e) {
			return next(e);
		}
	}

	/**
	 * @swagger
	 * /auth/info:
	 *   post:
	 *     summary: 사용자의 정보를 가져옵니다.
	 *     tags:
	 *	     - Auth
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: header
	 *         name: Authorization
	 *         type: string
	 *         schema:
	 *           $ref: "#/definitions/Token"
	 *     responses:
	 *       200:
	 *         schema:
	 *           $ref: "#/definitions/ResponseInfo"
	 */
	public async Info(req: Request, res: Response, next: NextFunction) {
		try {
			let decoded: any = jwt.verify(req.headers["authorization"].split("Bearer ")[1], process.env.JWT_SECRET_KEY);
			User.findOne({ _id: decoded._id }, (err, result) => {
				if (err) throw err;
				if (result != null) {
					return super.Response(res, true, 200, "유저 정보를 성공적으로 가져왔습니다", {
						data: {
							_id: result._id,
							email: result.email,
							useranme: result.username,
							lastLoginTime: result.lastLoginTime,
							createdTime: result.createdTime,
							loginCount: result.loginCount,
							deviceId: result.deviceId,
							notification: result.notification,
						},
					});
				} else {
					return super.Response(res, false, 400, "아이디가 존재하지 않습니다");
				}
			});
		} catch (e) {
			return next(e);
		}
	}
	/**
	 * @swagger
	 * /auth/update_notification:
	 *   put:
	 *     summary: 사용자의 앱 FCM을 설정합니다.
	 *     tags:
	 *	     - Auth
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: body
	 *         name: body
	 *         type: object
	 *         schema:
	 *           $ref: "#/definitions/RequestUpdateNotification"
	 *       - in: header
	 *         name: Authorization
	 *         type: string
	 *         schema:
	 *           $ref: "#/definitions/Token"
	 *     responses:
	 *       200:
	 *         schema:
	 *           $ref: "#/definitions/ResponseUpdateNotification"
	 */
	public async UpdateNotification(req: Request, res: Response, next: NextFunction) {
		try {
			const { status }: { status: boolean } = req.body;
			let decoded: any = jwt.verify(req.headers["authorization"].split("Bearer ")[1], process.env.JWT_SECRET_KEY);
			User.findOne({ _id: decoded._id }, async (err, result) => {
				if (err) throw err;
				if (result != null) {
					result.notification = status;
					await result.save();
					return super.Response(res, true, 200, "성공적으로 업데이트 했습니다");
				} else {
					return super.Response(res, false, 400, "아이디가 존재하지 않습니다");
				}
			});
		} catch (e) {
			return next(e);
		}
	}
}

export default new AuthController();
