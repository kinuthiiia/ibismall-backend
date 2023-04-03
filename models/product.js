import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";
import mongooseAlgolia from "mongoose-algolia";

const { Schema } = mongoose;

export const ProductSchema = new Schema(
  {
    name: String,
    images: [String],
    ratings: [Number],
    reviews: [
      {
        customer: { type: Schema.Types.ObjectId, ref: "Customer" },
        text: String,
        timestamp: String,
      },
    ],
    soldQuantity: Number,
    price: Number,
    priceBefore: Number,
    flashEnd: String,
    tags: [String],
    seller: { type: Schema.Types.ObjectId, ref: "Seller" },
    category: { type: Schema.Types.ObjectId, ref: "LowLevel" },
    description: String,
    single: Boolean,
    variant: [
      {
        image: String,
        label: String,
        removed: Boolean,
        quantity: Number,
      },
    ],
    sizes: [String],
    fromAbroad: Boolean,
    soldOut: Boolean,
    removed: Boolean,
  },
  {
    collection: "products",
  }
);

// ProductSchema.plugin(mongooseAlgolia, {
//   appId: "YTL735AQT8",
//   apiKey: "b2ea580efc532f0628015e8b2048d7a2",
//   indexName: "westgate-products", //The name of the index in Algolia, you can also pass in a function
// });

ProductSchema.index({ name: "text" });

ProductSchema.plugin(timestamps);

ProductSchema.index({ createdAt: 1, updatedAt: 1 });

export const Product = mongoose.model("Product", ProductSchema);

// Product.SyncToAlgolia(); //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)
// Product.SetAlgoliaSettings({
//   searchableAttributes: ["name", "category"], //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
// });
