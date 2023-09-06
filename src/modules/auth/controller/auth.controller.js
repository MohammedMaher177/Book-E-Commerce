import cookie_parser from "cookie-parser"
import { catchError } from "../../../util/ErrorHandler/catchError.js"
import UserModel from "../../../../DB/models/user.model.js"
import { AppError } from "../../../util/ErrorHandler/AppError.js"
import { v4 as uuidv4 } from 'uuid';
import sendEmail from "../../../util/email/sendEmail.js";
import { emailTemp } from "../../../util/email/emailTemp.js";

export const signup = await catchError(async (req, res, next) => {
    const {email} = req.body
    const existEmail = await UserModel.findOne({ email })
    if (existEmail) {
        throw new AppError("Email Already Exist", 403)
    }
    const n = uuidv4()
    
    req.body.virefyCode = n.split("-")[0]

    const user = await UserModel.create(req.body)

    await sendEmail({
        to: email,
        subject: "Verify Your Email",
        html: emailTemp(req.body.virefyCode)
    })
    res.json({ message: "success", user })
})



export const deleteUser = catchError(async(req, res)=>{
    const {id} = req.params
    const de = await UserModel.findByIdAndDelete(id)
    res.json(de)
})