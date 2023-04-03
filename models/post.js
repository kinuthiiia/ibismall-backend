import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const PostSchema = new Schema(
  {
    caption: String,
    images: [String],
    seller: { type: Schema.Types.ObjectId, ref: "Seller" },
  },
  {
    collection: "posts",
  }
);

PostSchema.plugin(timestamps);

PostSchema.index({ createdAt: 1, updatedAt: 1 });

export const Post = mongoose.model("Post", PostSchema);
