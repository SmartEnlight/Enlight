import { model, Schema, Model, Document } from "mongoose";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt-nodejs";
import * as moment from "moment";
import Token from "./token";
const userSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	lastLoginTime: {
		type: String,
		required: true,
	},
	createdTime: {
		type: String,
		required: true,
	},
	loginCount: {
		type: Number,
		required: true,
	},
	notification: {
		type: Boolean,
		required: true,
	},
	deviceId: {
		type: String,
		required: true,
	},
});
export interface IUser extends Document {
	id: string;
	password: string;
	email: string;
	username: string;
	lastLoginTime: string;
	createdTime: string;
	loginCount: string;
	deviceId: string;
	notification: boolean;
}
export interface UserCreate {
	email: string;
	password: string;
	username: string;
	deviceId: string;
}
export interface UserSignIn {
	email: string;
	password: string;
	deviceId: string;
}
export interface Result {
	message: string;
	success: boolean;
}
export interface ResultSignIn {
	message: string;
	success: boolean;
	token?: string;
}
export interface UserDocument extends Document, IUser {
	//methods 등록
}
export interface IUserDocument extends Model<UserDocument> {
	//statics methods 등록
	getToken(): Promise<any>;
	create(): Promise<Result>;
	loginAuthentication();
	signIn(): Promise<ResultSignIn>;
}

userSchema.statics.create = async function (data: UserCreate): Promise<Result> {
	return new Promise(async function (resolve, reject) {
		try {
			if (await User.findOne({ email: data.email })) {
				return resolve({ success: false, message: "아이디 중복" });
			}

			let createdTime = moment().format("YYYY-MM-DD HH:mm:ss");
			bcrypt.hash(data.password, null, null, async function (err, hash) {
				const user: any = new User({
					email: data.email,
					password: hash,
					username: data.username,
					lastLoginTime: createdTime,
					createdTime: createdTime,
					loginCount: 0,
					deviceId: data.deviceId,
					notification: true,
				});
				user.save().then((data) => {
					return resolve({
						success: true,
						message: "회원가입을 성공 하였습니다.",
					});
				});
			});
		} catch (err) {
			return reject({ success: false, message: "DB 오류." });
		}
	});
};
userSchema.statics.signIn = async function (data: UserSignIn): Promise<ResultSignIn> {
	return new Promise(async function (resolve, reject) {
		try {
			User.findOne({ email: data.email }, (err, result) => {
				if (err) throw err;
				if (result != null) {
					bcrypt.compare(data.password, result.password, async (err, value) => {
						if (value == true) {
							const TokenCreateResult = await Token.create(result._id, "accessToken");
							++result.loginCount;
							result.lastLoginTime = moment().format("YYYY-MM-DD HH:mm:ss");
							if (data.deviceId) {
								result.deviceId = data.deviceId;
							}
							await result.save();
							return resolve({
								message: "로그인에 성공했습니다",
								success: true,
								token: TokenCreateResult.token,
							});
						} else {
							return resolve({ message: "비밀번호가 일치하지않습니다", success: false });
						}
					});
				} else {
					return resolve({ message: "아이디가 존재하지 않습니다", success: false });
				}
			});
		} catch (err) {
			return reject({ message: "DB 오류", success: false });
		}
	});
};
userSchema.statics.loginAuthentication = async function (data) {
	try {
		let user = await this.findOne({ _id: data._id });
		if (!user) {
			return { message: "존재하지 않은 계정입니다.", success: false };
		} else {
			return { message: "인증 성공", success: true };
		}
	} catch (err) {
		throw err;
	}
};

const User: Model<UserDocument> = model("User", userSchema) as IUserDocument;
export default User;
