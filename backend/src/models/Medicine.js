import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Item code/ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
      minlength: [2, "Medicine name must be at least 2 characters"]
    },
    manufacturer: {
      type: String,
      required: [true, "Manufacturer is required"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment", "Drops"],
        message: "Category must be one of Tablet, Capsule, Syrup, Injection, Cream, Ointment, Drops"
      }
    },
    price: {
      type: Number,
      required: [true, "Price per unit is required"],
      min: [0.01, "Price must be greater than 0"]
    },
    quantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Quantity cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number"
      }
    },
    expiryDate: {
      type: String,
      required: [true, "Expiry date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Expiry date must be in YYYY-MM-DD format"]
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Virtual for Stock Status
medicineSchema.virtual("status").get(function () {
  if (this.quantity <= 0) return "Out of Stock";
  if (this.quantity <= 10) return "Low Stock";
  return "Available";
});

// Virtual for Expiry Status
medicineSchema.virtual("expiryStatus").get(function () {
  if (!this.expiryDate) return "Normal";
  const today = new Date().toISOString().slice(0, 10);
  if (this.expiryDate < today) return "Expired";

  const todayMs = new Date(today).getTime();
  const expMs = new Date(this.expiryDate).getTime();
  const diffDays = Math.ceil((expMs - todayMs) / (1000 * 60 * 60 * 24));
  if (diffDays <= 30) return "Expiring Soon";

  return "Normal";
});

// Text index for search performance
medicineSchema.index({ name: "text", manufacturer: "text", id: "text" });

export const Medicine = mongoose.model("Medicine", medicineSchema);
