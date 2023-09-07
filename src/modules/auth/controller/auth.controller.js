import cookie_parser from "cookie-parser"
import { catchError } from "../../../util/ErrorHandler/catchError.js"
import UserModel from "../../../../DB/models/user.model.js"
import { AppError } from "../../../util/ErrorHandler/AppError.js"
import { v4 as uuidv4 } from 'uuid';
import sendEmail from "../../../util/email/sendEmail.js";
import { emailTemp } from "../../../util/email/emailTemp.js";
import bcrypt from 'bcryptjs';
import Token from "../../../../DB/models/token.model.js";

export const signup = await catchError(async (req, res, next) => {
    const { email } = req.body
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
    res.status(201).json({ message: "success", user })
})



export const deleteUser = catchError(async (req, res) => {
    const { id } = req.params
    const de = await UserModel.findByIdAndDelete(id)
    res.status(202).json(de)
})


export const signin = catchError(async (req, res) => {

    const { email, password } = req.body

    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new AppError("this email doesn't exist", 400)
    }
    const isIdentical = await bcrypt.compare(password, user.password);
    if (!isIdentical) {
        throw new AppError("invalid email or password", 400)
    }

    const { token, refreshToken } = await getTokens(user._id.toString(), user.role);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });

    res.status(201).json({token});
    
})