import Stripe from "stripe";
import { catchError } from "../../../util/ErrorHandler/catchError.js";
import UserModel from "../../../../DB/models/user.model.js";
import { cartModel } from "../../../../DB/models/cart.model.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import { orderModel } from "../../../../DB/models/order.model.js";
import bookModel from "../../../../DB/models/book.model.js";
import { use } from "chai";
const stripe = new Stripe(process.env.STRIPE_SECRETE_KEY);

export const checkout = catchError(async (req, res, next) => {
  const { email } = req.user;
  const { shippingAdress, coupon_code , paymentMethod} = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) throw new AppError("this email doesn't exist", 404);
  const cart = await cartModel.findOne({ user: user._id });
  if (!cart) throw new AppError("this user dosen't have cart", 404);
  if (cart.books == []) throw new AppError("there are no books in the cart", 404);
  const order = await orderModel.create({
    user: user._id,
    books: cart.books,
    totalOrderPrice: cart.totalAmount,
    shippingAdress: shippingAdress,
    paymentMethod : paymentMethod , 
  });
  if (cart.totalAmountAfterDisc) {
    order.totalAmountAfterDisc = cart.totalAmountAfterDisc;
    order.coupon_code = coupon_code;
  }
  user.orders.push(order._id)
  user.save();
if (paymentMethod == "online") {
  var discount = [];
  if (cart.discount) {
    const coupon = await stripe.coupons.create({
      percent_off: cart.discount ,
      duration: "once",
      name: cart.coupon_code ,
    });
    discount = [{ coupon: coupon.id }];
  }
  let session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    line_items: cart.books.map((el) => {
      return {
        price_data: {
          currency: "egp",
          unit_amount: el.price * 100,
          product_data: {
            name: el.book.name,
            images: [el.book.image.secure_url],
          },
        },
        quantity: el.qty,
      };
    }),
    mode: "payment",
    success_url: "https://bookstore-front.codecraftsportfolio.online/",
    cancel_url: "https://bookstore-front.codecraftsportfolio.online/cart",
    customer_email: email,
    discounts: discount,
    client_reference_id : order._id.toString()

  });

  return res.json({ message: "success", session  , order});
}
  let books = cart.books.map((el) => ({
    updateOne: {
      filter: { _id: el.book._id },
      update: { $inc: { stock: -el.qty, sold: el.qty } },
    },
  }));

  // await bookModel.bulkWrite(books);
  // await cartModel.findByIdAndDelete(cart._id)

  res.json({ message: "success" , order , user});
})

export const successCheckOut =catchError(async(request, response) => {
 
  const sig = request.headers['stripe-signature'].toString();
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.COMPLETE_SESSION_SIGNING_SECRET);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }
  const data = event.data.object;
if (event.type=="checkout.session.completed") {
const email = data.customer_email
  const user = await UserModel.findOne({ email });
  const order = await orderModel.findById(data.client_reference_id);
  order.paidAt = Date.now();
  order.isPaid = true;
  order.save();
  // let books = cart.books.map((el) => ({
  //   updateOne: {
  //     filter: { _id: el.book._id },
  //     update: { $inc: { stock: -el.qty, sold: el.qty } },
  //   },
  // }));

  // await bookModel.bulkWrite(books);
  // const cart = await cartModel.findOne({ user: user._id });
  // await cartModel.findByIdAndDelete(cart._id)
  
}else{
  console.log(`Unhandled event type ${event.type}`);
   await orderModel.findByIdAndDelete(data.client_reference_id);
}
  response.send();
})