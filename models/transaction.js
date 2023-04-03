import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const TransactionSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    payment: {
      transactionCode: String,
      paymentMode: String,
      amount: Number,
      timestamp: String,
    },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  {
    collection: "transactions",
  }
);

TransactionSchema.plugin(timestamps);

TransactionSchema.index({ createdAt: 1, updatedAt: 1 });

export const Transaction = mongoose.model("Transaction", TransactionSchema);
