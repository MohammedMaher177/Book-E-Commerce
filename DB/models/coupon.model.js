import mongoose, { Schema, Types, model } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    max_use: {
      type: Number,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    used_by: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    methods: {
      async decreaseMaxUse() {
        this.max_use--;
        await this.save();
      },
      checkIfUsedByUser(user_id) {
        const id = new Types.ObjectId(user_id);
        const isUsed = this.used_by.includes(id);
        return isUsed;
      },
      async addToUsedBy(user_id) {
        const id = new Types.ObjectId(user_id);
        this.used_by.push(id);
        this.max_use--;
        await this.save();
      },
      async increaseMaxUse() {
        this.max_use++;
        await this.save();
      },
      async removeFromUsedBy(user_id) {
        const userID = new Types.ObjectId(user_id);
        const index = this.used_by.findIndex(
          (ele) => ele.toString() === user_id
        );
        this.used_by.splice(index, 1);
        this.max_use++;
        await this.save();
      },
    },
    statics: {
      findByCode(code) {
        return this.findOne({ code });
      },
    },
  }
);

const Coupon = model("coupon", couponSchema);

export default Coupon;
