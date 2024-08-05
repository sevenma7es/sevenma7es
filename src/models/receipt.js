import mongoose, { Schema } from "mongoose";

const receiptSchema = new Schema(
  {
    number: { type: String, required: true, unique: true }, // Número de factura único
    issueDate: { type: Date, required: true }, // Fecha de emisión de la factura
    type: { type: String, required: true }, // Tipo de factura (A, B, C, etc.)
    supplier: {
      name: { type: String, required: true }, // Nombre o razón social del proveedor
      address: { type: String }, // Domicilio fiscal del proveedor
      cuit: { type: String, required: true }, // CUIT del proveedor
      ivaResponsibility: { type: String }, // Responsabilidad frente al IVA del proveedor
    },
    purchaser: {
      name: { type: String, required: true }, // Nombre o razón social del comprador
      cuit: { type: String, required: true }, // CUIT o CUIL del comprador
      address: { type: String }, // Domicilio del comprador (opcional)
    },
    items: [
      {
        description: { type: String, required: true }, // Descripción del producto o servicio
        quantity: { type: Number, required: true }, // Cantidad
        unitPrice: { type: Number, required: true }, // Precio unitario
        total: { type: Number, required: true }, // Total por ítem
        taxType: { type: String, required: true }, // Tipo de impuesto aplicado (IVA, etc.)
        taxAmount: { type: Number, required: true }, // Monto del impuesto aplicado por ítem
      },
    ],
    totalAmount: { type: Number, required: true }, // Importe total de la factura
    xmlGenerated: { type: Boolean, default: false }, // Indica si se generó el XML válido para AFIP
    xmlData: { type: String }, // Almacenará el XML generado para AFIP
  },
  {
    timestamps: true, // Permite registrar automáticamente las fechas de creación y actualización
  }
);

const Receipt = mongoose.model("Receipt", receiptSchema);
export default Receipt;
