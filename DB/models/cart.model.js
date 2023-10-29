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
      qty: { type: Number, default: 1 },
      price: Number,
      totalPrice:Number
    },
  ],
  totalAmount: { type: Number, default: 0 },
  totalAmountAfterDisc: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  coupun_code: String
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
  // console.log(this);
  this.populate("books.book", "image name price slug")
});

export const cartModel = model("cart", cartSchema);

// for useing custom methods
// const cart = new cartModel();
// cart.addToCart();
