import mongoose from "mongoose";
import Product from "./product.js"; // Importar el modelo de Product

const { Schema } = mongoose;

const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
});

const CustomerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  address: { type: AddressSchema, required: false },
  createdAt: { type: Date, default: Date.now },
});

const BuyingOrderSchema = new Schema({
  orderNumber: { type: String, required: true },
  issueDate: { type: Date, required: true },
  customer: { type: CustomerSchema, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Crear el modelo
const BuyingOrder = mongoose.model("BuyingOrder", BuyingOrderSchema);

export default BuyingOrder;
