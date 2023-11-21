import mongoose, { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    ISBN: {
      type: Number,
      unique: true,
      required: true,
      minLength: 10,
      maxLength: 13,
    },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    lang: { type: String, required: true },
    desc: { type: String },
    pages: { type: Number, required: true },
    image: { public_id: String, secure_url: String },
    sold: { type: Number, default: 0 },
    // sold: {
    //   type: {
    //     pdf: { type: Number, default: 0 },
    //     ebook: { type: Number, default: 0 },
    //     hardcover: { type: Number, default: 0 },
    //   },
    // },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    author: { type: String, required: true, trim: true },
    publisher: { type: String, required: true, trim: true },
    published: { type: Number, maxLength: 4 },
    category: {
      type: mongoose.ObjectId,
      required: true,
      ref: "category",
    },
    reviews: [
      {
        type: mongoose.ObjectId,
        ref: "review",
        default: [],
      },
    ],
    rating: {
      type: Number,
      maxLength: 1,
      default: 0,
    },
    variations: {
      type: [
        {
          variation_name: {
            type: String,
            required: true,
            enum: ["hardcover", "pdf", "e-book", "audio"],
            default: "pdf",
          },
          variation_price: { type: Number, required: true },
          variation_qty: Number,
          variation_url: { public_id: String, secure_url: String },
          variation_is_available: {
            type: Boolean,
            required: true,
            default: function () {
              if (
                this.variation_name === "pdf" ||
                this.variation_name === "e-book"
              ) {
                return true;
              }
              if (this.variation_qty > 0) {
                return true;
              }
              return false;
            },
          },
        },
      ],
      default: [],
      _id: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

bookSchema.pre(/^find/, { document: false, query: true }, function () {
  this.populate([
    {
      path: "category",
      select: "name slug",
    },
  ]);
});

bookSchema.pre(/^find/, { document: false, query: true }, function () {
  this.populate([
    {
      path: "reviews",
      select: "user content rating",
    },
  ]);
});
// bookSchema.virtual("reviews", {
//   ref: "review",
//   localField: "_id",
//   foreignField: "book",
//   // justOne: true,
// });

bookSchema.static("getCategoryName", async function (data) {
  const x = await this.find({ "category.name": { $regex: data } });
});

const bookModel = model("book", bookSchema);

export default bookModel;
