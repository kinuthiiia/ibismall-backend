import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const TopLevelSchema = new Schema(
  {
    label: String,
  },
  {
    collection: "toplevels",
  }
);

TopLevelSchema.plugin(timestamps);

TopLevelSchema.index({ createdAt: 1, updatedAt: 1 });

export const TopLevel = mongoose.model("TopLevel", TopLevelSchema);
