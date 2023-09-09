import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { bootstrap } from "./src/app.routes.js";
import cookie_parser from "cookie-parser";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors());
// app.use(cookie_parser);
app.use(express.json());
// ***************************
// log in with google 
app.set('view engine', 'ejs');
app.get('/google', (req, res) => {
    console.log("google");
      res.render('../login')
    //   http://localhost:3000/google
  })

//   ****************************
bootstrap(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// error mongoose@7.5.0: The engine "node" is incompatible with this module. Expected version ">=14.20.1". Got "14.17.0"

