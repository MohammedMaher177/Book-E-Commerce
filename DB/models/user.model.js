import bcryptjs from "bcryptjs";
import { Schema, Types, model } from "mongoose";



const userSchema = new Schema({
    userName: {
        type: String, trim: true, require: true, maxLength: 20, minLength: 4
    },
    email: {
        type: String, trim: true, require: true, maxLength: 30, minLength: 4, unique: true
    },
    password: {
        type: String, trim: true, require: true, maxLength: 25, minLength: 4
    },
    role: { type: String, enum: ['User', 'Admin'] },
    gender: { type: String, enum: ['Male', 'Female', 'Not Selected'], default: "Not Selected" },
    phone: { type: String },
    profile: {
        type: Types.ObjectId, ref: "Profile"
    },
    confirmedEmail: {
        type: Boolean, default: false
    }

})

userSchema.pre(["save", /^update/, /^create/], async function () {
    if (this.password) {
        this.password = await bcryptjs.hashSync(this.password, parseInt(process.env.SALT_ROUNDS))
    }
})

const UserModel = model("User", userSchema)

export default UserModel