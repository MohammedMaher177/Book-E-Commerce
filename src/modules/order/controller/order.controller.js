

import Stripe from 'stripe';
import { catchError } from '../../../util/ErrorHandler/catchError.js';
import UserModel from '../../../../DB/models/user.model.js';
import { cartModel } from '../../../../DB/models/cart.model.js';
const stripe = new Stripe(process.env.STRIPE_SECRETE_KEY);


export const checkOutSession = catchError(async(req,res,next)=>{
    const {_id , email }= req.user
    const user = await UserModel.findOne({ email });
    if (!user)throw new AppError("this email doesn't exist", 404);
    const cart = await cartModel.findOne({user: _id});
    if (!cart) throw new AppError("this user dosen't have cart", 404);
    //   console.log( email);
let session = await stripe.checkout.sessions.create({
    line_items:[{
        price_data:{
            currency:'egp',
            unit_amount: cart.totalAmount * 100 ,
            product_data:{
                name: user.userName
            }
        },
        quantity:1
    }],
    mode:"payment",
    success_url:"https://bookstore-front.codecraftsportfolio.online/",
    cancel_url:"https://bookstore-front.codecraftsportfolio.online/cart",
    customer_email:email,
    client_reference_id:"6502c6866fbcdcefafe2d943",
    // metadata:{
    //     //shipping address 
    // }
})

res.json({message:"success",session})
})