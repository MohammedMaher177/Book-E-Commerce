import dotenv from 'dotenv';


dotenv.config()

import express from 'express'
import { bootstrap } from './src/app.routes.js'
import cookie_parser from "cookie-parser"

const app = express()
const port = 3000

app.use(cookie_parser("1234"))
app.use(express.json())

bootstrap(app)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))