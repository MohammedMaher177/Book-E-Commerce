import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as facebookStrategy } from "passport-facebook"
import jwt from "jsonwebtoken"
import UserModel from "./DB/models/user.model.js";

const passportConfigGoogle = (passport) => {
  passport.use(new GoogleStrategy({
    callbackURL: process.env.MODE == "PRODUCTION" ? `https://bookstore-api.codecraftsportfolio.online/api/v1/auth/google/redirect` : 'http://localhost:3000/api/v1/auth/google/redirect',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let { id, displayName, emails } = profile.emails && profile; //profile object has the user info
        let user = await UserModel.findOne({ email: emails[0].value });
        if (!user) {
          user = await UserModel.create({
            userName: displayName,
            email: emails[0].value,
            confirmedEmail: emails[0].verified,
          })
        }
        const token = jwt.sign({
          id: user._id,
          role: user.role
        },
          process.env.TOKEN_SECRET,
          { expiresIn: "2h" }
        );
        // let redirect_url = `https://bookstore-front.codecraftsportfolio.online/auth/login/success/${token}`;
        let redirect_url = process.env.MODE == "PRODUCTION"? `https://bookstore-front.codecraftsportfolio.online/auth/login/success/${token}`:`http://localhost:3000/auth/login/success/${token}`;
        done(null, redirect_url);
      } catch (error) {
        done(error)
      }
    }
  ));
}
const passportConfigFacebook = (passport) => {
  passport.use(new facebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_SECRET_ID,
    callbackURL: process.env.MODE == "PRODUCTION" ? "https://bookstore-api.codecraftsportfolio.online/api/v1/auth/facebook/redirect" : "http://localhost:3000/api/v1/auth/facebook/redirect",
    profileFields: ['id', 'displayName', 'email']

  },
    async (token, refreshToken, profile, done) => {
      try {
        let { id, displayName, emails } = profile.emails && profile; //profile object has the user info
        let user = await UserModel.findOne({ email: emails[0].value });
        if (!user) {
          user = await UserModel.create({
            userName: displayName,
            email: emails[0].value,
            confirmedEmail: true,
          })
        }
        const token = jwt.sign({
          id: user._id,
          role: user.role
        },
          process.env.TOKEN_SECRET,
          { expiresIn: "2h" }
        );
        // let redirect_url = `https://book-store-front.onrender.com/auth/login/success/${token}`;
        let redirect_url = process.env.MODE == "PRODUCTION"?`https://book-store-front.onrender.com/auth/login/success/${token}`:`http://localhost:3000/auth/login/success/${token}`;
        done(null, redirect_url);
      } catch (error) {
        done(error)
      }
    }));

}
export { passportConfigGoogle, passportConfigFacebook }


// https://www.freeprivacypolicy.com/live/b869c30c-b1b7-4ba7-a8de-bd10cf6d86b7
// https://www.freeprivacypolicy.com/live/b869c30c-b1b7-4ba7-a8de-bd10cf6d86b7