import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const MidLevelSchema = new Schema(
  {
    label: String,
    topLevel: { type: Schema.Types.ObjectId, ref: "TopLevel" },
  },
  {
    collection: "midlevels",
  }
);
MidLevelSchema.plugin(timestamps);

MidLevelSchema.index({ createdAt: 1, updatedAt: 1 });

export const MidLevel = mongoose.model("MidLevel", MidLevelSchema);
