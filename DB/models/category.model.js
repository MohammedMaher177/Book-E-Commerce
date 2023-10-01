import mongoose , { Schema, model } from "mongoose";
import slugify from "mongoose-slug-generator";
mongoose.plugin(slugify)
const categorySchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    image: { public_id: String, secure_url: String },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    slug: {type: String, slug: "name"}
}, { timestamps: true })

const categoryModel = model('category', categorySchema)

export default categoryModel