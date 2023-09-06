import connectionDb from "../DB/dbConnection.js"



export const bootstrap = (app) => {
    connectionDb()

    app.get("/", (req, res, next) => res.json("hello orld"))
}