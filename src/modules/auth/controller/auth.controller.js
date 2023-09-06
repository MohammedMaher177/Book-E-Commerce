import cookie_parser from "cookie-parser"
import { catchError } from "../../../util/ErrorHandler/catchError.js"
import UserModel from "../../../../DB/models/user.model.js"
import { AppError } from "../../../util/ErrorHandler/AppError.js"

export const signup = await catchError(async (req, res, next) => {
    const existEmail = await UserModel.findOne({ email: req.body.email })
    if (existEmail) {
        throw new AppError("Email Already Exist", 403)
    }

    const user = await UserModel.create(req.body)

    

    res.json({ message: "success", user })
})

export const deleteUser = catchError(async(req, res)=>{
    const {id} = req.params
    const de = await UserModel.findByIdAndDelete(id)
    res.json(de)
})