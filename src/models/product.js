import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  publishedOn: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  relatedProducts: [
    { type: Schema.Types.ObjectId, ref: "Product", required: true },
  ],
  slug: { type: String, required: true },
  brand: { type: String, required: false },
  _status: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  __v: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
