import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema({
  user: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  books: [
    {
      book: { type: Types.ObjectId, ref: "book", required: true },
      variation_name: {
        type: String,
        required: true,
        enum: ["hardcover", "pdf", "e-book", "audio"],
      }, 
      qty: { type: Number, default: 1 },
      price: Number,
      totalPrice: Number,
      _id: false,
    },
  ],
  totalOrderPrice: { type: Number },
  shippingAddress: {
    address: { type: String },
    city: { type: String },
    country: { type: String },
    phone: { type: String },
  },
  paymentMethod: {
    type: String,
    enum: ["online", "cash"],
    default: "cash",
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDeliverd: {
    type: Boolean,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  totalAmountAfterDisc: { type: Number, default: 0 },
  coupon_code: {type:String}
});

orderSchema.pre([/^find/, "save"], function () {
  this.populate("books.book");
});

export const orderModel = model("order", orderSchema);
