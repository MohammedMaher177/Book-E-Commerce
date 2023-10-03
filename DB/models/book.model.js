import mongoose, { Schema, Types, model } from "mongoose";


const bookSchema = new Schema({
    ISBN:{type:Number ,unique: true, require: true ,minLength: 10, maxLength: 13 },
    name: { type: String, require: true, trim: true},
    lang:{type:String ,require: true },
    desc:{type:String },
    pages:{type:Number,require: true},

    image: { public_id: String, secure_url: String },

    stock: { type: Number, default: 0 },

    price: { type: Number, require: true },
    discount: { type: Number, default: 0 },

    author: { type: String, require: true, trim: true },
    publisher: { type: String, require: true, trim: true },
    published: { type: Number, maxLength: 4 },
    category: {
      type: mongoose.ObjectId,
      require: true,
      ref: "category",
    },
  },
  { timestamps: true }
);


bookSchema.pre(/^find/, function () {
  this.populate([
    {
      path: "category",
      select: "name slug -_id",
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

