import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required : true
    },
    phone: {
      type: String,
      required : true,
    },
    address: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "pending",
    },
    notes: {
      type: String,
      default: "",
    },
    total: {
      type: Number,
      required: true,
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true ,default: 1},
        image: { type: String, required: true },
      },
    ],
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;