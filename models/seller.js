import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const SellerSchema = new Schema(
  {
    name: String,
    image: String,
    description: String,
    email: String,
    password: String,
    phoneNumber: String,
    location: {
      constituency: String,
      county: String,
      country: String,
      description: String,
    },
    carousels: [String],
  },
  {
    collection: "sellers",
  }
);

SellerSchema.index({ name: "text" });

SellerSchema.plugin(timestamps);

SellerSchema.index({ createdAt: 1, updatedAt: 1 });

export const Seller = mongoose.model("Seller", SellerSchema);
