import mongoose, { Schema, Types, model } from "mongoose";
import categoryModel from "./category.model.js";


const bookSchema = new Schema({
    ISBN:{type:Number ,unique: true, require: true ,minLength: 10, maxLength: 13 },
    name: { type: String, require: true, trim: true},
    slug: { type: String, require: true, trim: true, unique: true},
    lang:{type:String ,require: true },
    desc:{type:String },
    pages:{type:Number,require: true},

    image: { public_id: String, secure_url: String },

    stock: { type: Number, default: 0 },

    price: { type: Number, require: true },
    discount: { type: Number, default: 0 },
    format : {
      type :[String], enums:["hardcover", "paperback", "e-book", "audiobook"], default: ['e-book']
    },
    author: { type: String, require: true, trim: true },
    publisher: { type: String, require: true, trim: true },
    published: { type: Number, maxLength: 4 },
    category: {
      type: mongoose.ObjectId,
      require: true,
      ref: "category",
    },
  },
  { timestamps: true , toJSON: true, toObject: true}
);


bookSchema.pre(/^find/, function () {
  this.populate([
    {
      path: "category",
      select: "name slug",
    },

  ]);
});

bookSchema.virtual("reviews", {
  ref: "review",
  localField: "_id",
  foreignField: "book",
  // justOne: true,
});

const bookModel = model("book", bookSchema);

export default bookModel;

