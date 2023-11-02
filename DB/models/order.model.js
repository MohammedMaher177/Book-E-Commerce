import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema({ 
  user: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  books: [
    {
      book: { type: Types.ObjectId, ref: "book", required: true },
      qty: { type: Number },
      price: Number,
      totalPrice:Number
    },
  ],
  totalOrderPrice: { type: Number},
  shippingAdress:{
   street:{type:String},
   city:{type:String},
   country:{type:String},
   phone:{type:Number},
  },
  paymentMethod:{
   type:String,
   enum:['card','cash'],
   default:'cash'
  },
  isPaid :{
    type:Boolean,
    default:false
  },
  paidAt:{
    type:Date
  },
  isDeliverd:{
    type:Boolean,
    default:false
  },
  deliveredAt:{
    type:Date
  },
  totalAmountAfterDisc: { type: Number, default: 0 },
  discount: { type: Number},
  coupon_code: {
    type: Types.ObjectId,
    required: true,
    ref: "copon",
  }
});


// orderSchema.pre([/^find/, 'save'], function () {
//   this.populate("books.book", "image name price slug")
// });

export const orderModel = model("order", orderSchema);

