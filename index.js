import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { bootstrap } from "./src/app.routes.js";
import cookie_parser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import bodyParser from "body-parser";
import {passportConfigGoogle , passportConfigFacebook} from "./passport-strategies.js"
import { AppError } from "./src/util/ErrorHandler/AppError.js";
const app = express();
const port = 8080; 
passportConfigGoogle(passport);
passportConfigFacebook(passport);
app.use(passport.initialize());
// const whiteList = ["http://localhost:3000", "https://localhost:3000", "http://localhost:8080", "https://localhost:8080", "https://book-store-an5l.onrender.com"]
const whiteList = ["http://localhost:3000", "https://localhost:3000", "http://localhost:8080", "https://localhost:8080", "https://accounts.google.com/", "https://accounts.google.com/", "https://book-store-an5l.onrender.com", "https://book-store-uusp.onrender.com"]
const corsOptions = {
    origin: function(origin, callback){
        console.log(origin);
        console.log("hi from origin + ", origin)
        console.log(whiteList.indexOf(origin));
        if(!origin){
            callback(null, true);
        }
        if(whiteList.indexOf(origin) !== -1){
            callback(null, true);
        }else{
            callback(new AppError('Not allowed by CORS'))
        }
    },
    credentials: true
}
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type", "X-Requested-With"],
    
}));
app.use(cookie_parser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));    

app.use('/he', function(req, res){
    console.log(req.body);
})
bootstrap(app);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

