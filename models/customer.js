import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const CustomerSchema = new Schema(
  {
    name: String,
    email: String,
    phoneNumber: String,
    addresses: [
      {
        constituency: String,
        county: String,
        country: String,
        default: { type: Boolean, default: false },
      },
    ],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    password: String,
    photo: String,
    cart: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  {
    collection: "customers",
  }
);
CustomerSchema.plugin(timestamps);

CustomerSchema.index({ createdAt: 1, updatedAt: 1 });

export const Customer = mongoose.model("Customer", CustomerSchema);
