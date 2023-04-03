import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const OrderSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    quantity: Number,
    variantIndex: Number,
    price: Number,
    placementDate: String,
    packagedDate: String,
    shippedDate: String,
    disbursementDate: String,
  },
  {
    collection: "orders",
  }
);

OrderSchema.plugin(timestamps);

OrderSchema.index({ createdAt: 1, updatedAt: 1 });

export const Order = mongoose.model("Order", OrderSchema);
