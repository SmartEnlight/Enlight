import { model, Schema, Model, Document } from "mongoose";
import User from "./user";
import { now } from "moment";
const moment = require("moment");
const deviceSchema = new Schema({
	key: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	data: {
		type: Array,
		required: true,
	},
	owner: {
		type: String,
		required: true,
	},
});
export interface IDevice extends Document {
	key: string;
	name: string;
	data: any[];
	owner: string;
}
export interface Result {
	message: string;
	success: boolean;
	data?: object;
}
export interface DeviceCreate {
	key: string;
	_id: string;
	name: string;
}
export interface DeviceGet {
	_id: string;
	date: object;
}
export interface DeviceUpdate {
	key: string;
	date: string;
	db: number;
}
export interface DeviceDocument extends Document, IDevice {}
export interface IDeviceDocument extends Model<DeviceDocument> {
	get(): Promise<Result>;
	create(): Promise<Result>;
	update(): Promise<Result>;
}
deviceSchema.statics.create = async function (data: DeviceCreate): Promise<Result> {
	return new Promise(async function (resolve, reject) {
		try {
			User.findOne({ _id: data._id }, function (err, result) {
				if (err) throw err;
				if (result != null) {
					Device.findOne({ key: data.key }, function (err, result) {
						if (err) throw err;
						if (result == null) {
							const device: any = new Device({
								key: data.key,
								name: data.name,
								data: [],
								owner: data._id,
							});
							device.save().then((data) => {
								return resolve({
									success: true,
									message: "회원가입을 성공 하였습니다.",
								});
							});
						} else {
							return resolve({ message: "이미 다른 기기에 등록 되었습니다.", success: false });
						}
					});
				} else {
					return resolve({ message: "해당 유저가 존재하지 않습니다", success: false });
				}
			});
		} catch (err) {
			return reject({ success: false, message: "DB 오류." });
		}
	});
};
deviceSchema.statics.get = async function (data: DeviceGet): Promise<Result> {
	return new Promise(async function (resolve, reject) {
		try {
			Device.find({ owner: data._id }, function (err, result) {
				if (result != null) {
					let resultData = {
						morning: 0,
						night: 0,
						total: 0,
					};
					for (const value of result) {
						for (const element of value.data) {
							let nowData = moment(data.date);
							let elementData = moment(element.data);
							//6 hour = 21600000ms
							//22 hour = 79200000ms
							if (nowData.format("YYYY-MM-DD") == elementData.format("YYYY-MM-DD")) {
								let ms = moment.duration({ hours: elementData.hour(), minutes: elementData.minutes() });
								resultData.total++;
								if (21600000 < ms && ms < 79200000) {
									resultData.morning++;
								} else {
									resultData.night++;
								}
							}
						}
					}
					return resolve({ success: true, message: "디바이스의 정보를 가져왔습니다.", data: resultData });
				} else {
					return reject({ success: false, message: "해당 유저의 디바이스가 없습니다" });
				}
			});
		} catch (err) {
			return reject({ success: false, message: "DB 오류." });
		}
	});
};
deviceSchema.statics.update = async function (data: DeviceUpdate): Promise<any> {
	return new Promise(async function (resolve, reject) {
		try {
			User.findOne({ _id: data.key }, function (err, userResult) {
				Device.findOne({ key: userResult.email }, function (err, result) {
					if (err) throw err;
					if (result != null) {
						result.data.push({ data: data.date, db: data.db });
						result.save().then((data) => {
							return resolve({
								success: true,
								message: "업데이트를 성공하였습니다.",
								data: userResult.deviceId,
								db: data.db,
							});
						});
					} else {
						return resolve({ message: "해당 키를 가지고 있는 디바이스는 없습니다.", success: false });
					}
				});
			});
		} catch (err) {
			return reject({ success: false, message: "DB 오류." });
		}
	});
};
const Device: Model<DeviceDocument> = model("Device", deviceSchema) as IDeviceDocument;
export default Device;
