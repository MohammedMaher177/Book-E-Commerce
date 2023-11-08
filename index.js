import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { bootstrap } from "./src/app.routes.js";
import cookie_parser from "cookie-parser";
import passport from "passport";
import bodyParser from "body-parser";
import { passportConfigGoogle, passportConfigFacebook } from "./passport-strategies.js"
import cors from "./src/middleware/cors.js";
const app = express();
const port = 8080;
// const port = 3000;
app.use(cors);
passportConfigGoogle(passport);
passportConfigFacebook(passport);
app.use(passport.initialize());
app.use(cookie_parser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

bootstrap(app);
app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        // Then define and call a function to handle the event checkout.session.completed
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
// export const server = app.listen(5000, () => console.log(`Example app listening on port 5000!`));
