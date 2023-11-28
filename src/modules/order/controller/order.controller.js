import Stripe from "stripe";
import { catchError } from "../../../util/ErrorHandler/catchError.js";
import UserModel from "../../../../DB/models/user.model.js";
import { cartModel } from "../../../../DB/models/cart.model.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import { orderModel } from "../../../../DB/models/order.model.js";
import bookModel from "../../../../DB/models/book.model.js";
import { use } from "chai";
import Feedback from "../../../../DB/models/feedBack.model.js";
import sendEmail from "../../../util/email/sendEmail.js";
import { feedbackEmail } from "../../../util/email/feedback.mail.js";
import { sendFeedbackEmail } from "../../../util/helper-functions.js";
const stripe = new Stripe(process.env.STRIPE_SECRETE_KEY);

export const checkout = catchError(async (req, res, next) => {
  const { email } = req.user;
  const { shippingAddress, name, paymentMethod } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) throw new AppError("this email doesn't exist", 404);
  const cart = await cartModel.findOne({ user: user._id });
  if (!cart) throw new AppError("this user dosen't have cart", 404);
  if (cart.books.length == 0) {
    throw new AppError("there are no books in the cart", 404);
  }
  let orderCount = await orderModel.find().count();
  // console.log(orderCount);
  const order = await orderModel.create({
    user: user._id,
    name: name || user.userName,
    books: cart.books,
    totalOrderPrice: cart.totalOrderPrice,
    totalAmountAfterDisc: cart.totalAmountAfterDisc,
    shippingAddress: shippingAddress,
    coupon_code: cart.coupon_code,
    paymentMethod: paymentMethod,
    serial_number: orderCount+1,
  });
  user.orders.push(order._id);
  user.save();
  if (paymentMethod == "online") {
    var discount = [];
    if (cart.discount) {
      const coupon = await stripe.coupons.create({
        percent_off: cart.discount * 100,
        duration: "once",
        name: cart.coupon_code,
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
      client_reference_id: order._id.toString(),
    });

    return res.json({ message: "success", session, order });
  }
  for (const el of cart.books) {
    let book = await bookModel.findById(el.book._id);
    book.sold += el.qty;
    if (el.variation_name == "hardcover") {
      book.variations[1].variation_qty -= el.qty;
    }
    book.save();
  }
  await cartModel.findByIdAndDelete(cart._id);

  res.json({ message: "success", order });
});

export const successCheckOut = catchError(async (request, response) => {
  const sig = request.headers["stripe-signature"].toString();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.COMPLETE_SESSION_SIGNING_SECRET
    );
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }
  const data = event.data.object;
  if (event.type == "checkout.session.completed") {
    const email = data.customer_email;
    const user = await UserModel.findOne({ email });
    const order = await orderModel.findById(data.client_reference_id);
    order.paidAt = Date.now();
    order.isPaid = true;
    order.save();
    for (const el of order.books) {
      let book = await bookModel.findById(el.book._id);
      book.sold += el.qty;
      if (el.variation_name == "hardcover") {
        book.variations[1].variation_qty -= el.qty;
      }
      book.save();
    }
    sendFeedbackEmail(user.email);
    const cart = await cartModel.findOne({ user: user._id });
    await cartModel.findByIdAndDelete(cart._id);
    //-------------------------------------------
    const alreadySubmitted = await Feedback.alreadySubmittedFeedback(user._id);
    if (!alreadySubmitted) {
      // add the email
    }
  } else {
    console.log(`Unhandled event type ${event.type}`);
    await orderModel.findByIdAndDelete(data.client_reference_id);
  }
  response.send();
});

export const getPdf = catchError(async (req, res, next) => {
  const { _id } = req.user;
  const user = await UserModel.findById(_id);
  if (!user) throw new AppError("this email doesn't exist", 404);
  const orders = await orderModel.find({ user: user._id });
  let pdfBooks = [];
  for (const el of orders) {
    for (const book of el.books) {
      if (
        book.variation_name == "pdf" &&
        !pdfBooks.includes(book.book._id) &&
        el.isPaid
      ) {
        pdfBooks.push(
          await bookModel.findById(book.book._id)
          
          );
      }
    }
  }
  res.json({ message: "success", pdfBooks, orders });
});

export const sendFeadbackEmail = catchError(async (req,res,next)=>{
  const {  email } = req.params;
  sendFeedbackEmail(email);
  res.json({ message: "success" });
})