

import { Router } from "express";
import { validate } from "../../middleware/authenticate.js";
import UserModel from "../../../DB/models/user.model.js";


const userRouter = Router()

userRouter.get("/", async (req, res) => {
    const users = await UserModel.find()
    res.json(users)
})

export default userRouter;