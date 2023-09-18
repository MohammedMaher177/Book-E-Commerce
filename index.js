import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { bootstrap } from "./src/app.routes.js";
import cookie_parser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import bodyParser from "body-parser";
import {passportConfigGoogle , passportConfigFacebook} from "./passport-strategies.js"
import AppError from "./src/util/ErrorHandler/AppError.js"
const app = express();
const port = 3000; 
passportConfigGoogle(passport);
passportConfigFacebook(passport);
app.use(passport.initialize());
const whiteList = ["http://localhost:3000", "https://localhost:3000", "http://localhost:8080", "https://localhost:8080", "https://book-store-an5l.onrender.com"]
const corsOptions = {
    origin: function(origin, callback){
        console.log(origin);
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
app.use(cors(corsOptions));
app.use(cookie_parser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
bootstrap(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

