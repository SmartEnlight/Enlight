import { model, Schema, Model, Document } from "mongoose";
import * as jwt from "jsonwebtoken";
import * as moment from "moment";
import User from "./user";
const tokenSchema = new Schema({
	token: {
		type: String,
		required: true,
	},
	createdTime: {
		type: String,
		required: true,
	},
	expirationTime: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	owner: {
		type: String,
		required: true,
	},
	revoked: {
		type: Boolean,
		required: true,
	},
});
export interface IToken extends Document {
	token: string;
	createdTime: string;
	expirationTime: string;
	type: "accessToken" | "refreshToken";
	owner: string;
	revoked: boolean;
}
export interface Result {
	message: string;
	success: boolean;
}
export interface TokenDocument extends Document, IToken {}
export interface ITokenDocument extends Model<TokenDocument> {
	create();
}
tokenSchema.statics.create = function (_id: string, type: string = "accessToken"): Promise<any> {
	return new Promise(async function (resolve, reject) {
		try {
			let Time = moment();

			if (type == "accessToken") {
				// accessToken 발급
				let accessToken = await jwt.sign(
					{
						_id: _id,
					},
					process.env.JWT_SECRET_KEY || "USER_SECRET",
					{
						expiresIn: 31536000, //초  1 years
					}
				);
				// token DB 저장
				const token: any = new Token({
					createdTime: Time.format("YYYY-MM-DD HH:mm:ss"),
					expirationTime: Time.add(1, "years"),
					type: "accessToken",
					owner: _id,
					revoked: false,
					token: accessToken,
				});
				token.save().then((data) => {
					return resolve({
						success: true,
						message: "저장 성공 하였습니다.",
						token: accessToken,
					});
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};
const Token: Model<TokenDocument> = model("Token", tokenSchema) as ITokenDocument;
export default Token;
