import mongoose, { Schema, Types, model } from "mongoose";
const feedbackSchema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      required: true,
    },
    testimonial: {
      type: String,
      required: true,
    },
    // searching_books: Number,
    website_rating: {
      type: Number,
      required: true,
    },
    delivery_rating: {
      type: Number,
      required: true,
    },
    delivery_packing_rating: {
      type: Number,
      required: true,
    },
    notes: String
  },
  {
    statics: {
      async alreadySubmittedFeedback(user_id) {
        const exsists = await this.findOne({ user_id });
        if (exsists) {
          return true;
        }
        return false;
      },
    },
  }
);
const Feedback = model("feedback", feedbackSchema);

export default Feedback;
