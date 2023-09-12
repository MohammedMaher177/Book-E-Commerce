import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { bootstrap } from "./src/app.routes.js";
import cookie_parser from "cookie-parser";
import cors from "cors";
import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import {passportConfigGoogle , passportConfigFacebook} from "./google_oauth.js"
import { facebookRedirect } from "./src/middleware/passport.js";
import { redirectWithToke } from "./src/modules/auth/controller/auth.controller.js";

const app = express();
const port = 3000; 

passportConfigGoogle(passport);
passportConfigFacebook(passport);
app.use(passport.initialize());
// app.use(passport.session());
app.use(cors());
// app.use(cookie_parser);
app.use(express.json());

app.get("/auth/facebook/redirect", facebookRedirect, redirectWithToke)

bootstrap(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// error mongoose@7.5.0: The engine "node" is incompatible with this module. Expected version ">=14.20.1". Got "14.17.0"

