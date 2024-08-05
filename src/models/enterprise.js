import mongoose, { Schema } from "mongoose";

const enterpriseSchema = new Schema(
  {
    name: { type: String, required: true }, // Nombre de la empresa
    legalName: { type: String }, // Nombre legal de la empresa (si es diferente)
    taxId: { type: String, required: true }, // Número de identificación fiscal (CUIT, CUIL, etc.)
    address: { type: String }, // Dirección física de la empresa
    city: { type: String }, // Ciudad de ubicación de la empresa
    province: { type: String }, // Provincia de ubicación de la empresa
    country: { type: String, default: "Argentina" }, // País de ubicación de la empresa (por defecto Argentina)
    phone: { type: String }, // Número de teléfono de contacto
    email: { type: String }, // Correo electrónico de contacto
    website: { type: String }, // Sitio web de la empresa
    logoUrl: { type: String }, // URL del logotipo de la empresa
    foundedYear: { type: Number }, // Año de fundación de la empresa
    businessType: { type: String }, // Tipo de negocio (ej. Servicios, Comercio, Manufactura, etc.)
    industry: { type: String }, // Industria a la que pertenece la empresa
    employees: { type: Number }, // Número de empleados
    revenue: { type: Number }, // Ingresos anuales estimados de la empresa
    isVATPayer: { type: Boolean, default: true }, // ¿Es la empresa contribuyente de IVA?
    vatCategory: { type: String }, // Categoría de IVA de la empresa (si aplica)
    createdAt: { type: Date, default: Date.now }, // Fecha de creación del registro
    updatedAt: { type: Date, default: Date.now }, // Fecha de última actualización del registro
    instagram: { type: String },
  },
  {
    timestamps: true, // Permite registrar automáticamente las fechas de creación y actualización
  }
);

const Enterprise = mongoose.model("Enterprise", enterpriseSchema);
export default Enterprise;
