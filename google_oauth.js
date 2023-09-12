import passport  from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import {Strategy as facebookStrategy} from "passport-facebook"
import jwt from "jsonwebtoken"
import UserModel from "./DB/models/user.model.js";

const passportConfigGoogle  = (passport)=>{
    passport.use(new GoogleStrategy({
    callbackURL: `http://localhost:3000/auth/google/redirect`,  //same URI as registered in Google console portal
    clientID: process.env.GOOGLE_CLIENT_ID, //replace with copied value from Google console
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let {id, displayName, emails} = profile.emails && profile; //profile object has the user info
        // let user = await db('users').select(['id', 'name', 'email']).where('email', user_email); //check whether user exist in database
        const user = await UserModel.findOne({email: emails[0].value});
        if(!user){
            const user = await UserModel.create({
                userName: displayName,
                email: emails[0].value,
                confirmedEmail: emails[0].verified,
            })
            let redirect_url = "http://localhost:3000/login";
        }
        console.log(user);
        let redirect_url = "http://localhost:3000/login";
        
        // if (user) {
        //   const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' }); //generating token
        //   redirect_url = `http://localhost:3000/${token}` //registered on FE for auto-login
        //   return done(null, redirect_url);  //redirect_url will get appended to req.user object : passport.js in action
        // } else {
        //   redirect_url = `http://localhost:3000/user-not-found/`;  // fallback page
        //   return done(null, redirect_url);
        // }
        // console.log(pr);
        return done(null, redirect_url);
      } catch (error) {
        done(error)
      }
    }
  ));
}
const passportConfigFacebook  = (passport)=>{
    passport.use(new facebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : process.env.FACEBOOK_CLIENT_ID,
        clientSecret    : process.env.FACEBOOK_SECRET_ID,
        callbackURL     : "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName','email']
    
    },// facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
    
        console.log(profile)
        return done(null,profile)
    }));
    
}
export  {passportConfigGoogle,passportConfigFacebook}