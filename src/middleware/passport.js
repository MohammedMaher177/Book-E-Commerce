import passport from "passport";

const google = passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
})

const googleRedirect = passport.authenticate("google", {
    session: false,
    failureRedirect: `https://localhost:3000/auth/login/failed`,
})

const facebook = passport.authenticate('facebook', { scope: 'email' })

const facebookRedirect = passport.authenticate('facebook', {
    session: false,
    failureRedirect: 'https://localhost:3000/auth/login/failed'
})

export { google, googleRedirect, facebook, facebookRedirect };