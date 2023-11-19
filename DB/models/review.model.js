import { Schema, Types, model } from "mongoose";

const reviewSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      require: [true, "Review Comment Required"],
    },
    book: { type: Types.ObjectId, require: true, ref: "book" },
    user: { type: Types.ObjectId, require: true, ref: "User" },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function () {
  this.populate("user", "userName email");
});

const reviewModel = model("review", reviewSchema);

export default reviewModel;