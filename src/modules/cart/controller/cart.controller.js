import bookModel from "../../../../DB/models/book.model.js";
import { cartModel } from "../../../../DB/models/cart.model.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import { catchError } from "../../../util/ErrorHandler/catchError.js";

function calcPrice(cart) {
  let totalPrice = 0;
  cart.products.forEach((ele) => {
    totalPrice += ele.qty * ele.price;
  });
  cart.totalAmount = totalPrice;
}

export const getCartDetails = catchError(async (req, res, next) => {
  const { _id } = req.user;
  let cart = await cartModel.findOne({ user: _id });
  if (!cart) {
    cart = await cartModel.create({ user: _id });
  }
  return res.status(201).json({ message: "success", cart });
});

export const addToCart = catchError(async (req, res, next) => {
  const { _id } = req.user;

  const existBook = await bookModel
    .findById(req.body.book)
    .select("price");
  if (!existBook) throw new AppError("In-Valid book ID", 404);
    console.log(existBook);
  if (req.body.qty < 1) throw new AppError("U Can not add 0 Qty", 403);
  req.body.qty = req.body.qty || 1;
  req.body.totalPrice = req.body.qty * existBook.price;
  req.body.price = existBook.price;
  let cart = await cartModel.findOne({ user: _id });
  if (!cart) {
    cart = await cartModel.create({
      user: _id,
      books: req.body,
      totalAmount: req.body.price,
    });
    return res.status(201).json({ message: "success", cart });
  }
  let index = cart.books.findIndex(
    (el) => el.book._id == req.body.book
  );
  if (index === -1) {
    cart.books.push(req.body);
  } else {
    req.body.qty += cart.books[index].qty;
    cart.books[index] = req.body;
  }
  cart.totalAmount = cart.books.reduce(
    (partialSum, a) => partialSum + a.price,
    0
  );

  if (cart.discount)
    cart.totalAmountAfterDisc =
      cart.totalAmount - cart.totalAmount * cart.discount;

  await cart.save();
  return res.status(201).json({ message: "success", cart });
});

export const updateCartQty = catchError(async (req, res, next) => {
  const { _id } = req.user;
  const { product } = req.body;
  let cart = await cartModel.findOne({ user: _id });
  if (!cart) return new AppError("Cart Not Found", 404);
  if (!req.body.qty) throw new AppError("In-Valid Product QTY", 403);
  let index = cart.products.findIndex((el) => el.product.id == product);
  if (index == -1) throw new AppError("In-Valid Product ID", 404);
  req.body.price = req.body.qty * cart.products[index].product.price;
  cart.products[index] = req.body;
  cart.totalAmount = cart.products.reduce(
    (partialSum, a) => partialSum + a.price,
    0
  );

  if (cart.discount)
    cart.totalAmountAfterDisc =
      cart.totalAmount - cart.totalAmount * cart.discount;

  await cart.save();
  return res
    .status(201)
    .json({ message: "success", cart, TotalCartPrice: cart.totalAmount });
});

export const removeItem = catchError(async (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;
  let cart = await cartModel.findOne({ user: _id });
  if (!cart) return new AppError("Cart Not Found", 404);
  let index = cart.products.findIndex((el) => el.product.id == id);
  if (index == -1) throw new AppError("In-Valid Product ID", 404);
  cart.products.splice(index, 1);
  cart.totalAmount = cart.products.reduce(
    (partialSum, a) => partialSum + a.price,
    0
  );
  if (cart.discount)
    cart.totalAmountAfterDisc =
      cart.totalAmount - cart.totalAmount * cart.discount;
  await cart.save();
  return res.json({ message: "success", cart });
});

export const removeCart = catchError(async (req, res, next) => {
  const { _id } = req.user;
  const cart = await cartModel.findOne({ user: _id });
  if (!cart) {
    cart = await cartModel.create({ user: _id });
    return res.status(201).json({ message: "success", cart });
  }
  cart.books = [];
  cart.totalAmount = 0;
  cart.totalAmountAfterDisc = 0;
  await cart.save();
  res.json({ message: "success", cart });
});

// export const applayCoupon = catchError(async (req, res, next) => {
//   const { code } = req.body;
//   const coupon = await couponModel.findOne({ code });
//   if (!coupon) throw new AppError("Coupon not found", 404);
//   const cart = await cartModel.findOne({ user: req.user._id });
//   cart.discount = coupon.discount;
//   cart.totalAmountAfterDisc =
//     cart.totalAmount - cart.totalAmount * cart.discount;

//   await cart.save();
//   res.status(202).json({ message: "success", cart });
// });
