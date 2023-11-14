import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema({
  user: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  books: [
    {
      book: { type: Types.ObjectId, ref: "book", required: true },
      variation_name: {
        
      },
      qty: { type: Number, default: 1 },
      price: Number,
      totalPrice:Number,
      _id: false
    },
  ],
  totalAmount: { type: Number, default: 0 },
  totalAmountAfterDisc: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  coupon_code:{ type:String}
});

cartSchema.method("addToCart", async function (prodId) {
  const allBooks = [...this.books];
  const index = allBooks.findIndex((prod) => prod.book === prodId);
  if (index === -1) {
    this.books.push({ book: prodId });
    await this.save();
    return;
  }
  allBooks[index].qty++;
  this.books = allBooks;
  await this.save();
});

cartSchema.pre([/^find/, 'save'], function () {
  this.populate("books.book", "image name price slug")
});

export const cartModel = model("cart", cartSchema);

// for useing custom methods
// const cart = new cartModel();
// cart.addToCart();
