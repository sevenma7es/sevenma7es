import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: "Category", default: null },
  properties: [{ type: Object }],
  slug: { type: String, required: true },
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;
