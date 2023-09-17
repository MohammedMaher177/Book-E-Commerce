import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { bootstrap } from "./src/app.routes.js";
import cookie_parser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import bodyParser from "body-parser";
import {passportConfigGoogle , passportConfigFacebook} from "./passport-strategies.js"

const app = express();
const port = 3000; 
passportConfigGoogle(passport);
passportConfigFacebook(passport);
app.use(passport.initialize());
const whiteList = ["http://localhost:3000", "https://localhost:3000", "http://localhost:8080", "https://localhost:8080"]
const corsOptions = {
    origin: function(origin, callback){
        if(whiteList.indexOf(origin) !== -1){
            callback(null, true);
        }
    },
    credentials: true
}
app.use(cors(corsOptions));
app.use(cookie_parser);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
bootstrap(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

