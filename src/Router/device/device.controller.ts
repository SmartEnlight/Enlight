import { Request, Response, NextFunction } from "express";
import Controller from "../../lib/controller";
import Device from "../../Model/device";
import * as jwt from "jsonwebtoken";
const { admin } = require("../../app");
class DeviceController extends Controller {
	constructor() {
		super();
	}
	/**
	 * @swagger
	 * /device/add:
	 *   post:
	 *     summary: 디바이스를 추가합니다.
	 *     tags:
	 *	     - Device
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: body
	 *         name: body
	 *         type: object
	 *         schema:
	 *           $ref: "#/definitions/RequestAddDevice"
	 *       - in: header
	 *         name: Authorization
	 *         type: string
	 *         schema:
	 *           $ref: "#/definitions/Token"
	 *     responses:
	 *       200:
	 *         schema:
	 *           $ref: "#/definitions/ResponseAddDevice"
	 */
	public async Add(req: Request, res: Response, next: NextFunction) {
		try {
			const { key, name } = req.body;
			if (super.CheckBlank(key, name)) {
				return super.Response(res, false, 400, "빈칸을 모두 입력해 주세요.");
			}
			let decoded: any = jwt.verify(req.headers["authorization"].split("Bearer ")[1], process.env.JWT_SECRET_KEY);
			let result = await Device.create({
				_id: decoded._id,
				key: key,
				name: name,
			});
			if (result.success) {
				return super.Response(res, true, 200, "디바이스를 성공적으로 추가 하였습니다.");
			} else {
				return super.Response(res, true, 400, result.message);
			}
		} catch (e) {
			return next(e);
		}
	}
	/**
	 * @swagger
	 * /device/get:
	 *   post:
	 *     summary: 해당 날짜의 층간소음 발생 건수를 가져옵니다.
	 *     tags:
	 *	     - Device
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: body
	 *         name: body
	 *         type: object
	 *         schema:
	 *           $ref: "#/definitions/RequestGetDevice"
	 *       - in: header
	 *         name: Authorization
	 *         type: string
	 *         schema:
	 *           $ref: "#/definitions/Token"
	 *     responses:
	 *       200:
	 *         schema:
	 *           $ref: "#/definitions/ResponseGetDevice"
	 */
	public async Get(req: Request, res: Response, next: NextFunction) {
		try {
			const { data } = req.body;
			if (super.CheckBlank(data)) {
				return super.Response(res, false, 400, "빈칸을 모두 입력해 주세요.");
			}
			let decoded: any = jwt.verify(req.headers["authorization"].split("Bearer ")[1], process.env.JWT_SECRET_KEY);
			let result = await Device.get({ _id: decoded._id, data: data });

			if (result.success) {
				return super.Response(res, true, 200, "해당 날짜의 층간소음 발생 건수를 성공적으로 가져왔습니다.", { list: result.data });
			} else {
				return super.Response(res, false, 400, result.message);
			}
		} catch (e) {
			return next(e);
		}
	}
	/**
	 * @swagger
	 * /device/update:
	 *   post:
	 *     summary: 층간소음이 발생하면 요청합니다.
	 *     tags:
	 *	     - Device
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: body
	 *         name: body
	 *         type: object
	 *         schema:
	 *           $ref: "#/definitions/RequestUpdateDevice"
	 *     responses:
	 *       200:
	 *         schema:
	 *           $ref: "#/definitions/ResponseUpdateDevice"
	 */
	public async Update(req: Request, res: Response, next: NextFunction) {
		try {
			const { key, data, db } = req.body;
			if (super.CheckBlank(data)) {
				return super.Response(res, false, 400, "빈칸을 모두 입력해 주세요.");
			}
			let result = await Device.update({ key: key, data: data, db: db });
			if (result.success) {
				//FCM코드
				let fcm_message = {
					notification: {
						title: "Enlight",
						body: "HI",
					},
					data: {
						fileno: "44",
						style: "test",
					},
					token: result.data,
				};
				admin
					.messaging()
					.send(fcm_message)
					.then((e) => {
						return super.Response(res, true, 200, "FCM을 성공적으로 보냈습니다.");
					})
					.catch((e) => {
						return super.Response(res, false, 400, "데이터는 저장했지만 FCM을 보내지 못했습니다.");
					});
			} else {
				return super.Response(res, true, 400, result.message);
			}
		} catch (e) {
			return next(e);
		}
	}
}

export default new DeviceController();
