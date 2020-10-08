import { model, Schema, Model, Document } from "mongoose";
import * as moment from "moment";
const groupSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	inviteCode: {
		type: Number,
		required: true,
	},
	schedule: {
		type: Array,
		required: true,
	},
});
export interface IGroup extends Document {
	title: string;
	inviteCode: string;
	schedule: Array<Schema.Types.ObjectId>;
}
export interface Result {
	message: string;
	success: boolean;
}
export interface GroupCreate {
	title: string;
	text: string;
	email: string;
}
export interface GroupDocument extends Document, IGroup {}
export interface IGroupDocument extends Model<GroupDocument> {
	get(): Promise<Result>;
}
groupSchema.statics.get = async function (data: GroupCreate): Promise<Result> {
	return new Promise(async function (resolve, reject) {
		try {
			// Post.find({}, function (err, result) {
			// 	if (err) {
			// 		console.log(err);
			// 	}
			// 	var r = result.reverse();
			// 	return resolve({
			// 		success: true,
			// 		message: "게시물을 성공적으로 가져왔습니다.",
			// 		data: r,
			// 	});
			// });
		} catch (err) {
			return reject({ success: false, mes: "DB 오류." });
		}
	});
};
const Group: Model<GroupDocument> = model("Group", groupSchema) as IGroupDocument;
export default Group;
