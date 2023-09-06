import mongoose, { Schema, Types, model } from "mongoose";


const bookSchema = new Schema({
    ISBN:{type:Number ,unique: true, require: true ,minLength: 10, maxLength: 13 },
    name: { type: String, require: true, trim: true},
    desc:{type:String },
    pages:{type:Number,require: true},
    image:{
        data: Buffer,
        contentType: String
    },
    stock:{type:Number, default:0},


    price:{type:Number , require:true},
    discount:{type:Number, default:0},


    author:{type:String ,require: true , trim:true},
    publisher:{type:String ,require: true , trim:true},
    published:{type:Number ,maxLength:4},
    category:{
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "category"},

    

    rating:{type:Number,default:1,min:1,max:5},
    reviews:[{
        review :{
        type: mongoose.Types.ObjectId,
        ref:"review"
    }
}]
   
}, { timestamps: true })

const bookModel = model("book", bookSchema)

bookSchema.pre("findOne", function () {
    this.populate([{
        path: "category",
        select:"name -_id"
    }])
})

export default bookModel;