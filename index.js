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

// app.use(session({
//   secret: '7861',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: true,
//     maxAge: 3000000 *60
//   },
//   store: MongoStore.create({  
//     mongoUrl:'mongodb+srv://Book-E-Commerce:Book-E-Commerce@atlascluster.7mr3zao.mongodb.net/BookStore', 
//     collection: 'session',
//     ttl: 28800 
//   })
// }))
app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {
    session: false,
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
