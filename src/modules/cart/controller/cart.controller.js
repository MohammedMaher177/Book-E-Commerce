import bookModel from "../../../../DB/models/book.model.js";
import { cartModel } from "../../../../DB/models/cart.model.js";
import Coupon from "../../../../DB/models/coupon.model.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import { catchError } from "../../../util/ErrorHandler/catchError.js";

function calcPrice(cart) {
  return (cart.totalAmount = cart.books.reduce(
    (partialSum, book) => partialSum + book.totalPrice,
    0
  ));
}

function calcDiscount(cart) {
  if (cart.discount)
    return (cart.totalAmountAfterDisc = //.15
      cart.totalAmount - cart.totalAmount * cart.discount);
  else return (cart.totalAmountAfterDisc = cart.totalAmount);
}

async function existingBook(id) {
  const existBook = await bookModel.findById(id).select("price");
  return existBook;
}

async function addNewBook(cart, el) {
  const product = await bookModel
    .findById(el.book._id)
    .select("price variations name");
  if (!product) {
    throw new AppError(`In-Valid Book Id ${el.book._id}`);
  }
  product.cuurent_varaton = product.variations.find((book) => {
    if (book.variation_name === el.variation_name) return book;
  });
  if (!product.cuurent_varaton) {
    throw new AppError(`In-Valid Variation name of ${product.name}`);
  }
  return cart.books.push({
    book: el.book._id,
    qty: el.qty,
    price: product.cuurent_varaton.variation_price,
    totalPrice: el.qty * product.cuurent_varaton.variation_price,
    variation_name: el.variation_name,
  });
}

export const getCartDetails = catchError(async (req, res, next) => {
  console.log("111");
  const { _id } = req.user;
  let cart = await cartModel.findOne({ user: _id });
  if (!cart) {
    cart = await cartModel.create({ user: _id });
  }
  return res.status(201).json({ message: "success", cart });
});

export const creatUserCart = catchError(async (req, res, next) => {
  const { books } = req.body;
  // console.log(books);
  const { _id } = req.user;
  const existCart = await cartModel.findOne({ user: _id });
  if (!existCart.books.length) {
    for (let i = 0; i < books.length; i++) {
      await addNewBook(existCart, books[i]);
    }
  } else if (existCart.books.length > 0) {
    for (const el of books) {
      let flag = true;
      existCart.books.map((existBook) => {
        if (
          el.book._id.toString() === existBook.book._id.toString() &&
          el.variation_name === existBook.variation_name
        ) {
          flag = false;
          if (el.variation_name === "hardcover") {
            existBook.qty = el.qty;
            existBook.totalPrice = existBook.qty * existBook.price;
          }
        }
      });

      if (!flag) {
        continue;
      }
      await addNewBook(existCart, el);
    }
  }
  calcPrice(existCart);
  calcDiscount(existCart);
  console.log(existCart);
  await existCart.save();
  const realCart = await cartModel.findOne({ user: _id });
  res.json({ cart: realCart, message: "success" });
});

export const addToCart = catchError(async (req, res, next) => {
  const { _id } = req.user;
  console.log(req.body);
  const existBook = await existingBook(req.body.book);

  if (!existBook) throw new AppError("In-Valid book ID", 404);
  req.body.qty =
    req.body.variation_name !== "hardcover" ? 1 : req.body.qty || 1;
  let cart = await cartModel.findOne({ user: _id });

  if (!cart) {
    cart = await cartModel.create({
      user: _id,
      books: [],
      totalAmount: 0,
    });
    await addNewBook(cart, req.body);
    await cart.save();
    return res.status(201).json({ message: "success", cart });
  }

  let index = cart.books.findIndex(
    (el) =>
      el.book._id == req.body.book &&
      el.variation_name == req.body.variation_name
  );
  req.body.book = {_id:req.body.book};
  if (index === -1) {
    await addNewBook(cart, req.body);
  } else {
    if (req.body.variation_name === "hardcover") {

      cart.books[index].qty += req.body.qty;
      cart.books[index].totalPrice = cart.books[index].qty * cart.books[index].price;
      // cart.books[index] = { ...req.body };
    }
  }
  calcPrice(cart);
  calcDiscount(cart);
  await cart.save();
  const existCart = await cartModel.findOne({ user: _id });
  return res.status(201).json({ message: "success", cart: existCart });
});

export const updateCartQty = catchError(async (req, res, next) => {
  const { _id } = req.user;
  const { book } = req.body;
  let cart = await cartModel.findOne({ user: _id });

  if (!cart) return new AppError("Cart Not Found", 404);

  let index = cart.books.findIndex(
    (el) => el.book._id == book && el.variation_name == "hardcover"
  );
  if (index == -1) throw new AppError("In-Valid book ID", 404);

  // req.body.totalPrice = req.body.qty * cart.books[index].book.price;
  // req.body.price = cart.books[index].book.price;
  // req.body.variation_name = "hardcover";
  // cart.books[index].qty = req.body.qty;
  cart.books[index].qty = req.body.qty;
  cart.books[index].totalPrice = cart.books[index].qty * cart.books[index].price;
  calcPrice(cart);
  calcDiscount(cart);

  await cart.save();

  return res.status(202).json({ message: "success", cart });
});

export const removeItem = catchError(async (req, res, next) => {
  const { _id } = req.user;
  const { id, variation_name } = req.params;
  let cart = await cartModel.findOne({ user: _id });
  if (!cart) return new AppError("Cart Not Found", 404);
  console.log(cart.books);
  let index = cart.books.findIndex(
    (el) => el.book._id == id && el.variation_name == variation_name
  );
  if (index == -1) throw new AppError("In-Valid Product ID", 404);
  cart.books.splice(index, 1);
  console.log(cart.books);
  calcPrice(cart);
  calcDiscount(cart);
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

export const addCouponToCart = catchError(async (req, res, next) => {
  const { code } = req.body;
  const { _id } = req.user;
  const coupon = await Coupon.findByCode(code);
  if (!coupon) {
    throw new AppError("Coupon not found", 404);
  }
  if (coupon.max_use === 0) {
    throw new AppError("This code is not available anymore", 440);
  }
  const isUsed = coupon.checkIfUsedByUser(_id);
  if (isUsed) {
    throw new AppError("You used this code before", 440);
  }
  await coupon.addToUsedBy(_id);
  const cart = await cartModel.findOne({ user: _id });
  cart.coupon_code = coupon.code;
  cart.discount = coupon.amount;
  calcDiscount(cart);
  await cart.save();
  res.status(201).json({ message: "success", cart, coupon });
});

export const removeCouponFromCart = catchError(async (req, res, next) => {
  const { code } = req.params;
  const { _id } = req.user;
  const coupon = await Coupon.findByCode(code);
  if (!coupon) {
    throw new AppError("Coupon not found", 404);
  }
  await coupon.removeFromUsedBy(_id);
  const cart = await cartModel.findOne({ user: _id });
  cart.coupon_code = "";
  cart.discount = 0;
  calcDiscount(cart);
  await cart.save();
  res.status(201).json({ message: "success", cart, coupon });
});
