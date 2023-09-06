
import { Schema, Types, model } from "mongoose";


const profileSchema = new Schema({
    addresses: [{
        type: String, trim: true, require: true, maxLength: 20, minLength: 4
    }],
    age: {
        type: Number, max: 99, min: 12
    },
    fav_cats: [{
        type: Types.ObjectId, ref: "category"
    }],
    image: [{ public_id: String, secure_url: String }],
    whish_list: {
        type: Types.ObjectId, ref: "Book"
    }
})

const ProfileModel = model("Profile", profileSchema)


export default ProfileModel;