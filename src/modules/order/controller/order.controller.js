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

  if (paymentMethod=='online') {
    let session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items: [
        {
          price_data: {
            currency: "egp",
            unit_amount: cart.totalAmount * 100,
            product_data: {
              name: user.userName,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://bookstore-front.codecraftsportfolio.online/",
      cancel_url: "https://bookstore-front.codecraftsportfolio.online/cart",
      customer_email: email,
      client_reference_id: user._id,
     
    });
   return res.json({ message: "success" , session});
  }
  const order = await orderModel.create({
    user: user._id,
    books: cart.books,
    totalOrderPrice: cart.totalAmount,
    shippingAdress: shippingAdress,
  });
  if (cart.totalAmountAfterDisc) {
    order.totalAmountAfterDisc = cart.totalAmountAfterDisc;
    order.coupon_code = coupon_code;
  }
  let books = cart.books.map((el) => ({
    updateOne: {
      filter: { _id: el.book._id },
      update: { $inc: { stock: -el.qty, sold: el.qty } },
    },
  }));

  // await bookModel.bulkWrite(books);
  // await cartModel.findByIdAndDelete(cart._id)

  res.json({ message: "success" , order});
})

export const successCheckOut =catchError(async(request, response) => {
 
  const sig = request.headers['stripe-signature'].toString();
  let event;
  try {
    console.log(request);
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.COMPLETE_SESSION_SIGNING_SECRET);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }
if (event.type=="checkout.session.completed") {
  const checkoutSessionCompleted = event.data.object;
  console.log("create order here ......");
}else{
  console.log(`Unhandled event type ${event.type}`);
}
  response.send();
})