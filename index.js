import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { bootstrap } from "./src/app.routes.js";
import cookie_parser from "cookie-parser";
import passport from "passport";
import bodyParser from "body-parser";
import { passportConfigGoogle, passportConfigFacebook } from "./passport-strategies.js"
import cors from "./src/middleware/cors.js";
import { successCheckOut } from "./src/modules/order/controller/order.controller.js";
const app = express();
const port = 8080;
// const port = 3000;

app.post('https://bookstore-api.codecraftsportfolio.online/api/v1/order/webhook',
 express.raw({type: 'application/json'}),successCheckOut);

app.use(cors);
passportConfigGoogle(passport);
passportConfigFacebook(passport);
app.use(passport.initialize());
app.use(cookie_parser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

bootstrap(app);
 
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
// export const server = app.listen(5000, () => console.log(`Example app listening on port 5000!`));
