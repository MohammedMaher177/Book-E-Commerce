import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { bootstrap } from "./src/app.routes.js";
import cookie_parser from "cookie-parser";
import cors from "cors";
import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import {passportConfigGoogle , passportConfigFacebook} from "./google_oauth.js"

const app = express();
const port = 3000; 

// passport.use(
//   new GoogleStrategy(
//     {
//       callbackURL: `http://localhost:3000/auth/google/redirect`, //same URI as registered in Google console portal
//       clientID: process.env.GOOGLE_CLIENT_ID, //replace with copied value from Google console
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user_email = profile.emails && profile.emails[0].value; //profile object has the user info
//         // let user = await db('users').select(['id', 'name', 'email']).where('email', user_email); //check whether user exist in database
//         let redirect_url = "http://localhost:3000/login";
//         // if (user) {
//         //   const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' }); //generating token
//         //   redirect_url = `http://localhost:3000/${token}` //registered on FE for auto-login
//         //   return done(null, redirect_url);  //redirect_url will get appended to req.user object : passport.js in action
//         // } else {
//         //   redirect_url = `http://localhost:3000/user-not-found/`;  // fallback page
//         //   return done(null, redirect_url);
//         // }
//         return done(null, redirect_url);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );
passportConfigGoogle(passport);
passportConfigFacebook(passport);
app.use(passport.initialize());
// app.use(passport.session());
app.use(cors());
// app.use(cookie_parser);
app.use(express.json());
// ***************************
// log in with google
// app.set("view engine", "ejs");
// app.get('/google', (req, res) => {
//     console.log("google");
//       res.render('../login')
//     //   http://localhost:3000/google
//   })

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

app.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `https://localhost:3000/login`,
  }),
  (req, res) => {
    console.log(req.user);
    res.redirect(req.user); //req.user has the redirection_url
  }
);


app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect : 'https://localhost:3000/login',
        failureRedirect : 'https://localhost:3000/login'
    }
));
app.get("/login", (req, res) => {
  // console.log(req.user);
  res.status(200).json({ message: "done" });
});
//   ****************************
bootstrap(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// error mongoose@7.5.0: The engine "node" is incompatible with this module. Expected version ">=14.20.1". Got "14.17.0"
