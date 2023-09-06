import { Schema, model } from "mongoose";


const categorySchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        unique: true,
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true })

const categoryModel = model('category', categorySchema)

export default categoryModel