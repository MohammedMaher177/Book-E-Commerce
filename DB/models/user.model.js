import bcryptjs from "bcryptjs";
import { Schema, Types, model } from "mongoose";



const userSchema = new Schema({
    userName: {
        type: String, trim: true, required: true, maxLength: 20, minLength: 4
    },
    email: {
        type: String, trim: true, required: true,  unique: true
    },
    password: {
        type: String, trim: true
    },
    role: { type: String, enum: ['User', 'Admin'], default: "User" },
    gender: { type: String, enum: ['Male', 'Female', 'Not Selected'], default: "Not Selected" },
    phone: { type: String },
    addresses: [{
        address: String, city:String, phone:String
    }],
    age: {
        type: Number, max: 99, min: 12
    },
    defultAddress: {
        address: String, city:String

    },
    fav_cats: [{
        type: Types.ObjectId, ref: "category"
    }],
    whish_list: [{
        type: Types.ObjectId, ref: "book"
    }],
    confirmedEmail: {
        type: Boolean, default: false
    },
    virefyCode:{
        code:String,
        date:Number
    },
    status:{
        type:String, enum: ['active','deactive','reseting password','not confirmed'], default:'not confirmed'
    },
    searchedBooks:[
        {
            type: Types.ObjectId, ref: "book",
            default: []
        }
    ],
    searchedCats:[
        {
            type: Types.ObjectId, ref: "category",
            default: []
        }
    ],
    orders:[
        {
            type: Types.ObjectId, ref: "order",
            default: []
        }
    ]
    // registerway:{type: String, enum: ['form', 'facebook', 'google'], default: "form"}


}, { timestamps: true, v: false })

userSchema.pre(["save", /^update/, /^create/], async function () {
    const defultRound = parseInt(process.env.SALT_ROUNDS)
    if (this.password && bcryptjs.getRounds(this.password) != defultRound) {
        this.password = await bcryptjs.hash(this.password, parseInt(process.env.SALT_ROUNDS))
    }
})
userSchema.pre(/^find/, async function () {
    this.populate("fav_cats")
})
userSchema.pre(/^find/, async function () {
    // this.populate("orders")
})
// userSchema.pre(/^find/, async function () {
//     this.populate("whish_list")
// })

const UserModel = model("User", userSchema)

export default UserModel