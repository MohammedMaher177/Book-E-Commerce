import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { bootstrap } from "./src/app.routes.js";
import cookie_parser from "cookie-parser";
import cors from "cors";
import passport from "passport";

import {passportConfigGoogle , passportConfigFacebook} from "./google_oauth.js"
import bodyParser from "body-parser";

const app = express();
const port = 3000; 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

passportConfigGoogle(passport);
passportConfigFacebook(passport);
app.use(passport.initialize());
app.use(cors());
// app.use(cookie_parser);

bootstrap(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

