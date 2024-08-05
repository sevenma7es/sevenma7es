import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      default: ["customer"],
    },
    cart: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
    salt: String,
    password: String,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    verified: { type: Boolean, default: false },
    resetToken: String,
    resetTokenExpiry: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
