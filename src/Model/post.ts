import { model, Schema, Model, Document } from "mongoose";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt-nodejs";
import * as moment from "moment";
const postSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  like: {
    type: Number,
    required: true,
  },
  likeUsers: {
    type: Array,
    required: true,
  },
  createdTime: {
    type: String,
    required: true,
  },
  host_email: {
    type: String,
    required: true,
  },
});
export interface IPost extends Document {
  text: string;
  like: number;
  likeUsers: string[];
  createdTime: string;
  host_email: string;
}
export interface Result {
  message: string;
  success: boolean;
  data?: any;
}
export interface PostCreate {
  title: string;
  text: string;
  email: string;
}
export interface PostDocument extends Document, IPost {}
export interface IPostDocument extends Model<PostDocument> {
  create();
  get();
  find();
  like();
  unlike();
}
postSchema.statics.create = async function (data: PostCreate): Promise<Result> {
  return new Promise(async function (resolve, reject) {
    try {
      let now = moment();
      let createdTime = now.format("YYYY-MM-DD HH:mm:ss");
      const post: any = new Post({
        title: data.title,
        text: data.text,
        like: 0,
        likeUsers: [],
        createdTime: createdTime,
        host_email: data.email,
      });
      post.save().then((data) => {
        return resolve({
          success: true,
          message: "게시물을 성공적으로 업로드 하였습니다.",
        });
      });
    } catch (err) {
      return reject({ success: false, message: "DB 오류." });
    }
  });
};
postSchema.statics.get = async function (data: PostCreate): Promise<Result> {
  return new Promise(async function (resolve, reject) {
    try {
      Post.find({}, function (err, result) {
        if (err) {
          console.log(err);
        }
        var r = result.reverse();
        return resolve({
          success: true,
          message: "게시물을 성공적으로 가져왔습니다.",
          data: r,
        });
      });
    } catch (err) {
      return reject({ success: false, mes: "DB 오류." });
    }
  });
};
const Post: Model<PostDocument> = model("Post", postSchema) as IPostDocument;
export default Post;
