import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const LowLevelSchema = new Schema(
  {
    label: String,
    midLevel: { type: Schema.Types.ObjectId, ref: "MidLevel" },
  },
  {
    collection: "lowlevels",
  }
);
LowLevelSchema.plugin(timestamps);

LowLevelSchema.index({ createdAt: 1, updatedAt: 1 });

export const LowLevel = mongoose.model("LowLevel", LowLevelSchema);
